export default function stateReducer(state, action) {
    switch (action.type) {
        case 'init':
            return {
                ...state,
                data: action.data,
                originalData: action.data,
                isLoading: false,
            }
        case 'change':
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.name]: action.value
                }
            }
        case 'cancel':
            return {
                ...state,
                data: state.originalData,
                isEditing: false,
            }
        case 'updated':
            return {
                ...state,
                originalData: state.data,
                isEditing: false,
            }
        case 'begin-editing':
            return {
                ...state,
                isEditing: true,
            }
    }
};

export const initialState = {
    isEditing: false,
    isLoading: true,
    originalData: {},
    data: {}
};