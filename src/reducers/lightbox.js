const intialLightbox = {
    isVisible: false,
    slide: 0
  };
  
  const lightbox = (state = intialLightbox, action) => {
    switch (action.type) {
      case 'RESET':
        return intialLightbox;
      case "TOGGLE_LB_VISIBLE":
        return {
          ...state,
          isVisible: !state.isVisible 
        };
        case "SET_LB_SLIDE":
        return {
          ...state,
          slide: action.slideNum
        };
     
      default:
        return state;
    }
  };
  
  export default lightbox;
  