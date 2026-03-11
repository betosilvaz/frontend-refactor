export function stateReducer(state, action) {
  switch (action.type) {
    case "set-location":
      return {
        ...state,
        greenroof: {
          ...state.greenroof,
          latitude: action?.latitude || state?.greenroof?.latitude,
          longitude: action?.longitude || state?.greenroof?.longitude,
          address: action?.address || state?.greenroof?.address || null,
        }
      }
    case "on-greenroof-change":
      return {
        ...state,
        greenroof: {
          ...state.greenroof,
          [action.name]: action.value
        }
      }
    case "on-reservoir-change":
      return {
        ...state,
        reservoir: {
          ...state.reservoir,
          [action.name]: action.value
        }
      }
    case "on-vegetation-change":
      return {
        ...state,
        greenroof: {
          ...state.greenroof,
          vegetation: action.tags
        }
      }
    case "add-image":
      return {
        ...state,
        images: {
          ...state?.images,
          toAdd: [
            ...state?.images?.toAdd,
            action.image
          ]
        }
      }
    case "remove-image":
      // Se a imagem tiver um ID, ela já existe no banco de dados (original)
      const isExistingImage = action.image && action.image.id;

      if (isExistingImage) {
        return {
          ...state,
          images: {
            ...state.images,
            // Remove da lista de exibição (original)
            original: state.images.original.filter((img) => img.id !== action.image.id),
            // Adiciona à lista de IDs que serão deletados no backend
            toRemove: [...state.images.toRemove, action.image.id]
          }
        };
      }

      // Se não tem ID, é uma imagem recém-adicionada (Blob/File) que ainda não foi salva
      return {
        ...state,
        images: {
          ...state.images,
          // Filtramos pelo índice ou pelo próprio objeto de arquivo
          toAdd: state.images.toAdd.filter((_, index) => index !== action.index)
        }
      };
    default:
      return state;
  }
}

export const initialState = {
    greenroof: {
      isAccessible: false,
      isMandatory: false,
    },
    reservoir: {},
    images: {
      toAdd: [],
      toRemove: [],
      original: []
    }
  }