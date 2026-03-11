import { toast } from "react-hot-toast";

export default function useSubmit() {

  const submitGreenRoof = async (data) => {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify(payload),
    };
    try {
      const res = await fetch("http://localhost:8080/api/green-roofs", options);
      if (!res.ok) throw new Error("Erro ao cadastrar telhado!");
      toast.success("Telhado cadastrado com sucesso!");
      const data = await res.json();
      return data;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }

  const submitReservoir = async () => {
    const payload = { ...data, greenRoofId };
    const endpoint = "http://localhost:8080/api/green-roofs/" + greenRoofId + "/reservoirs";
    const options = {
      method: "POST",
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
    }
  }

  const submitImages = async () => {
    let formData = new FormData();
    images.forEach(file => {
      formData.append("images", file);
    });
    formData.append("greenRoofId", greenRoofId);
    const endpoint = "http://localhost:8080/api/green-roofs/" + greenRoofId + "/images";
    const options = {
      method: "POST",
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
    }
  }

  const validate = (state) => {
    const { greenroof } = state;
    if (!greenroof) return false;
    if (!greenroof.latitude || !greenroof.longitude || !greenroof.address) return false;
    return true;
  }

  return {
    submitGreenRoof,
    submitReservoir,
    submitImages,
    validate,
  }

}