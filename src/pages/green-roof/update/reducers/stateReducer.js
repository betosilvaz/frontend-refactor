export function stateReducer(state, action) {
  switch (action.type) {
    case "set-location":
      return {
        ...state,
        latitude: action?.latitude || state?.latitude,
        longitude: action?.longitude || state?.longitude,
        address: action?.address || state?.address || null,
      }
    case "on-greenroof-change":
      return {
        ...state,
        [action.name]: action.value
      }
    case "on-reservoir-change":
      return {
        ...state,
        reservoir: {
          ...state.reservoir,
          [action.name]: action.value
        }
      }
    case "set-original-vegetation":
      return {
        ...state,
        vegetation: {
          ...state.vegetation,
          originals: action.value.map(v => ({ id: v.id, value: v.name }))
        }
      };
    case "on-vegetation-change":
      const { tags } = action;
      // Filtra o que é novo (sem ID) para o toAdd
      const newTags = tags.filter(t => !t.id).map(t => typeof t === 'string' ? t : t.value);
      
      return {
        ...state,
        vegetation: {
          ...state.vegetation,
          toAdd: newTags
        }
      };
    case "remove-vegetation-original":
      const { tagId } = action;
      return {
        ...state,
        vegetation: {
          ...state.vegetation,
          // Remove da lista de exibição original
          originals: state.vegetation.originals.filter(t => t.id != tagId),
          // Adiciona ao array de exclusão para o backend
          toRemove: [...state.vegetation.toRemove, tagId]
        }
      };
    case "set-original-images":
      return {
        ...state,
        images: {
          ...state.images,
          originals: action.images
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
            originals: state.images.originals.filter((img) => img.id !== action.image.id),
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
  isAccessible: false,
  isMandatory: false,
  vegetation: {
    originals: [],
    toRemove: [],
    toAdd: []
  },
  reservoir: {},
  images: {
    toAdd: [],
    toRemove: [],
    originals: []
  }
}