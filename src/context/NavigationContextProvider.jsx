import React,{useState} from "react";
import NavigationContext from "./NavigationContext";

const NavigationContextProvider = ({children}) => {
    const [artifactsClicked, setArtifactsClicked] = useState(false);
  const [membersClicked, setMembersClicked] = useState(false);
  const [aboutUsClicked, setAboutUsClicked] = useState(false);
  const [clearSection, setClearSection] = useState(false)
  const [translateToMarathi, setTranslateToMarathi] = useState(false)

  const setSectionClicked = (section) => {
    setArtifactsClicked(section === 'artifacts');
    setMembersClicked(section === 'members');
    setAboutUsClicked(section === 'aboutUs');
    setClearSection(section === 'clearAll')
  };
    return (
        <NavigationContext.Provider value={{ artifactsClicked, membersClicked, aboutUsClicked,clearSection,translateToMarathi, setSectionClicked, setTranslateToMarathi }}>
            {children}
        </NavigationContext.Provider>
    )
}

export default NavigationContextProvider