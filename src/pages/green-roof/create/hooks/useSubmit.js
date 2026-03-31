import { toast } from "react-hot-toast";
import { API_URL } from "@config/api/api.js"

/**
 * A função valida os dados do formulário e, caso estejam corretos, submete o telhado, o reservatório e as imagens para a API.
 */
export default function useSubmit() {
  const submit = async (state) => {
    if (!isValid(state)) return toast.error("Por favor, preencha todos os campos obrigatórios!");

    let formData = new FormData();

    let { images, vegetation, ...data } = state;
    data.vegetation = vegetation.toAdd;
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

    if (state.images && state.images.toAdd && state.images.toAdd.length > 0) {
      images.toAdd.forEach(file => formData.append("images", file));
    }

    try {
      let response = await fetch(`${API_URL}/api/green-roofs`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error("Não foi possível cadastrar os dados!");
      }
      toast.success("Dados cadastrados com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }

  }
  return submit;
}

function isValid(state) {
  if (!state.latitude || !state.longitude || !state.address) return false;
  return true;
}