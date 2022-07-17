import type { NextPage } from "next";
import { TreemapInputForm } from "../components/TremapInputForm.component";
import {
  TreemapGeneratorContextProvider,
  TreemapGeneratorMenuEnum,
  useTreemapGeneratorContext,
} from "../context/TreemapGenerator.context";
import { CSSTransition } from "react-transition-group";
import { FC } from "react";
import { TreemapView } from "../components/TreemapView.component";

const TreemapGeneratorPage: FC = ({ ...props }) => {
  const { activeMenu } = useTreemapGeneratorContext();
  return (
    <div className="bg-black text-white flex flex-col justify-center px-4 lg:px-10 py-10 min-h-screen">
      {/* Mobile Conversation Selection Menu */}
      <CSSTransition
        classNames="csstransition-menu--primary"
        in={activeMenu === TreemapGeneratorMenuEnum.InputForm}
        unmountOnExit
        timeout={200}
      >
        <TreemapInputForm />
      </CSSTransition>

      {/* Mobile Conversation Area Menu */}
      <CSSTransition
        classNames="csstransition-menu--secondary"
        in={activeMenu === TreemapGeneratorMenuEnum.TreemapView}
        unmountOnExit
        timeout={200}
      >
        <TreemapView />
      </CSSTransition>
    </div>
  );
};

const TreemapGeneratorPageWrapper: NextPage = ({ ...props }) => {
  return (
    <TreemapGeneratorContextProvider>
      <TreemapGeneratorPage {...props} />
    </TreemapGeneratorContextProvider>
  );
};

export default TreemapGeneratorPageWrapper;
