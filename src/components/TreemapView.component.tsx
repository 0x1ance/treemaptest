import { RefreshIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  TreemapDatapointType,
  useTreemapGeneratorContext,
} from "../context/TreemapGenerator.context";
import { useSizeObserver } from "../context/useSizeObserver";

export const TreemapView = () => {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Treemap />
      <div className="text-center mt-6 lg:mt-10">
        <button
          type="submit"
          className="bg-white text-black rounded-3xl px-5 py-2 flex space-x-2 items-center"
        >
          <RefreshIcon className="w-5 h-5" />
          <div>Regenerate Treemap</div>
        </button>
      </div>
    </div>
  );
};

const GAP_SIZE_IN_PX = 4;

const Treemap: FC = () => {
  const { treemapData } = useTreemapGeneratorContext();
  const { innerWidth } = useSizeObserver();
  const [rows, _setRows] = useState<TreemapDatapointType[][]>(() => {
    let splittedRows = [];
    let i = 0;
    let remainingNumberOfChunks = treemapData.numberOfRow;
    while (remainingNumberOfChunks > 0) {
      // for the last chunk -> return all
      if (remainingNumberOfChunks === 1) {
        splittedRows.push(treemapData.data.slice(i, treemapData.data.length));
      } else {
        // random sample a chunk size from index i to currentChunkSize
        const currentChunkSize =
          Math.floor(
            Math.random() *
              (treemapData.data.length - i - remainingNumberOfChunks)
          ) + 1;
        splittedRows.push(treemapData.data.slice(i, i + currentChunkSize));
        i += currentChunkSize;
      }

      remainingNumberOfChunks--;
    }
    return splittedRows;
  });
  const refContainer = useRef<HTMLDivElement>(null);
  const { current: elContainer } = refContainer;

  if (!treemapData || !treemapData.data || !treemapData.numberOfRow) {
    return null;
  }

  let rowHeight = 0;
  if (elContainer) {
    const { clientHeight } = elContainer;

    rowHeight =
      (clientHeight - (treemapData.numberOfRow - 1) * GAP_SIZE_IN_PX) /
      treemapData.numberOfRow;
  }
  if (typeof window === "undefined") {
    return <></>;
  }

  return (
    <div
      ref={refContainer}
      className={`bg-gray-800 flex-1 w-full flex flex-col gap-[4px]`}
      style={{ maxWidth: innerWidth }}
    >
      {rows.map((rowData, idx) => {
        return <TreemapRow height={rowHeight} rowData={rowData} key={idx} />;
      })}
    </div>
  );
};

const TreemapRow: FC<{
  height: number;
  rowData: TreemapDatapointType[];
}> = ({ height, rowData }) => {
  const { innerWidth } = useSizeObserver();
  const refContainer = useRef<HTMLDivElement>(null);
  const { current: elContainer } = refContainer;

  let unitWidthPerWeight = 0;
  if (elContainer) {
    const totalWeight = rowData.reduce((prev, curr) => prev + curr.weight, 0);
    const { clientWidth } = elContainer;
    unitWidthPerWeight =
      (clientWidth - (rowData.length - 1) * GAP_SIZE_IN_PX) / totalWeight;
  }

  if (typeof window === "undefined") {
    return <></>;
  }

  return (
    <div
      className="w-full bg-gray-800 flex gap-[4px]"
      style={{ height, maxWidth: innerWidth }}
      ref={refContainer}
    >
      {rowData.map((el, idx) => {
        return (
          <TreemapRowElement
            key={idx}
            unitWidthPerWeight={unitWidthPerWeight}
            datapoint={el}
          />
        );
      })}
    </div>
  );
};

const TreemapRowElement: FC<{
  unitWidthPerWeight: number;
  datapoint: TreemapDatapointType;
}> = ({ datapoint, unitWidthPerWeight }) => {
  const { weight, value, name } = datapoint;

  if (typeof window === "undefined") {
    return <></>;
  }
  return (
    <div
      style={{ width: unitWidthPerWeight * weight }}
      className={clsx(
        value > 0 ? "bg-red-400" : value < 0 ? "bg-green-400" : "bg-gray-400",
        "flex flex-col items-center justify-center text-gray-800"
      )}
    >
      <div className="text-2xl lg:text-3xl font-semibold">{name}</div>
      <div className="text-lg lg:text-xl font-medium">
        {value > 0 ? "+" : ""}
        {value * 100}%
      </div>
    </div>
  );
};
