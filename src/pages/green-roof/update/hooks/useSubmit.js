import toast from "react-hot-toast";

// TODO: refatorar pra usar o id do reservatório ao invés de usar o id do telhado verde para atualizar o reservatório, isso porque pode ser que um telhado verde tenha mais de um reservatório no futuro, e aí vai ser necessário atualizar um reservatório específico ao invés de atualizar o primeiro reservatório do telhado verde
export default function useSubmit() {
  
  const submitGreenRoof = async (payload, greenRoofId) => {
    let endpoint = `${API_URL}/api/green-roofs/${greenRoofId}`;
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify(payload),
    };
    try {
      const res = await fetch(endpoint, options);
      if (!res.ok) throw new Error("Erro ao cadastrar telhado!");
      toast.success("Telhado cadastrado com sucesso!");
      const data = await res.json();
      return data;
    } catch (err) {
      toast.error(err.message);
      console.log(err.message);
      return false;
    }
  }

  const submitReservoir = async (payload, greenRoofId) => {
    const endpoint = `${API_URL}/api/green-roofs/${greenRoofId}/reservoirs`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify(payload),
    };
    try {
      const res = await fetch(endpoint, options)
      if (!res.ok) throw new Error("Erro ao cadastrar reservatório!")
      toast.success("Reservatório cadastrado com sucesso!")
    } catch (err) {
      toast.error(err.message)
      console.error(err.message);
    }
  }

  const submitImages = async (images, greenRoofId) => {
    let formData = new FormData();
    images.forEach(file => {
      formData.append("images", file);
    });
    formData.append("greenRoofId", greenRoofId);
    const endpoint = `${API_URL}/api/green-roofs/${greenRoofId}/images`;
    const options = {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: formData,
    };
    try {
      const res = await fetch(endpoint, options);
      if (!res.ok) throw new Error("Erro ao salvar as imagens!");
    } catch (err) {
      toast.error(err.message);
      console.error(err.message);
    }
  }

  const validate = (state) => {
    const { greenroof } = state;
    if (!greenroof) return false;
    if (!greenroof.latitude || !greenroof.longitude || !greenroof.address) return false;
    return true;
  }

  const submit = async () => {
    if (!validate(state)) return toast.error("Por favor, preencha todos os campos obrigatórios!");
    let greenroof = await submitGreenRoof(state.greenroof, id);
    if (!greenroof) return;
    setGreenRoofId(greenroof.id);
    submitReservoir(state?.reservoir, id);
    submitImages(state?.images?.toAdd, id);
    setSuccessfullySubmitted(true);

  }

  return submit;
}