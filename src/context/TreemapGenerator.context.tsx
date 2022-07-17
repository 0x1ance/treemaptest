import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export enum TreemapGeneratorMenuEnum {
  InputForm = "INPUT_FORM",
  TreemapView = "TREEMAP_VIEW",
}

export type TreemapDatapointType = {
  name: string;
  weight: number;
  value: number;
};

type TreemapGeneratorContexteProps = {
  activeMenu: TreemapGeneratorMenuEnum;
  setActiveMenu: Dispatch<SetStateAction<TreemapGeneratorMenuEnum>>;
  treemapData: { data: TreemapDatapointType[]; numberOfRow: number };
  setTreemapData: Dispatch<
    SetStateAction<{
      data: TreemapDatapointType[];
      numberOfRow: number;
    }>
  >;
};

const TreemapGeneratorContext = createContext<TreemapGeneratorContexteProps>({
  activeMenu: TreemapGeneratorMenuEnum.InputForm,
  setActiveMenu: () => {},
  treemapData: {
    data: [],
    numberOfRow: 0,
  },
  setTreemapData: () => {},
});

export const TreemapGeneratorContextProvider: FC<PropsWithChildren> = ({
  ...props
}) => {
  const [activeMenu, setActiveMenu] = useState<TreemapGeneratorMenuEnum>(() => {
    return TreemapGeneratorMenuEnum.TreemapView;
  });

  const [treemapData, setTreemapData] = useState<{
    data: TreemapDatapointType[];
    numberOfRow: number;
  }>({
    data: [
        {  "name": "A", "weight": 3, "value": -0.02 },
        {  "name": "B", "weight": 3, "value": 0.05 },
        {  "name": "C", "weight": 6, "value": 0.015 },
        {  "name": "D", "weight": 2, "value": 0 },
        {  "name": "E", "weight": 3, "value": 0.01 },
        {  "name": "F", "weight": 7, "value": 0.04 }
    ],
    numberOfRow: 4,
  });

  return (
    <TreemapGeneratorContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        treemapData,
        setTreemapData,
      }}
      {...props}
    />
  );
};

export const useTreemapGeneratorContext = () =>
  useContext(TreemapGeneratorContext);
