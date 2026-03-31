import toast from "react-hot-toast";
import { API_URL } from "@config/api/api.js";

/**
 * Retorna uma função que realiza toda a lógica de requisição referente a atualização
 * de dados de um telhado verde para a API do sistema
 */
export default function useSubmit() {
  const submit = async (state) => {
    if (!isValid(state)) return toast.error("Por favor, preencha todos os campos obrigatórios!");

    let formData = new FormData();

    let { images, ...data } = state;
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

    if (state.images && state.images.toAdd && state.images.toAdd.length > 0) {
      images.toAdd.forEach(file => formData.append("images", file));
    }

    if (state.images && state.images.toRemove && state.images.toRemove.length > 0) {
      images.toRemove.forEach(id => formData.append("toRemove", id));
    }

    try {
      let response = await fetch(`${API_URL}/api/green-roofs/${state.id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error("Não foi possível atualizar os dados!");
      }
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }

  }
  return submit;
}

/**
 * Valida se os campos obrigatórios foram preenchidos
 */
function isValid(state) {
  if (!state.latitude || !state.longitude || !state.address) return false;
  return true;
}