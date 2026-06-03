import { useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

import stateReducer, { initialState } from '../reducers/stateReducer';
import fetchThis from "@utils/fetchThis.js";
import { API_URL } from '@config/api/api.js';

export default function useProfileForm() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    async function getData() {
      try {
        const jwt = localStorage.getItem("jwt");
        const response = await fetchThis(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${jwt}` }
        });

        if (!response.ok) throw new Error((await response.json()).message);

        const responseData = await response.json();
        dispatch({type: 'init', data: responseData});
      } catch (err) {
        toast.error(err.message || "Erro ao carregar dados do perfil.");
      }
    }
    getData();
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetchThis(`${API_URL}/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(state.data)
      });

      if (!response.ok) throw new Error((await response.json()).message);

      dispatch({type: 'updated'})
      toast.success("Dados atualizados!");
    } catch(err) {
      toast.error(err.message || "Erro ao salvar alterações.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch({type: 'change', name, value})
  }

  function handleCancel() {
    dispatch({type: 'cancel'})
  }

  function beginEditing() {
    dispatch({type: 'begin-editing'});
  }

  return {
    state, dispatch,
    submit, handleChange, handleCancel, beginEditing
  }

}