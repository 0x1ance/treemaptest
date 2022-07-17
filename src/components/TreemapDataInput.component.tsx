import { ExclamationCircleIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useField, useFormikContext } from "formik";
import React from "react";

export const TreemapDataInput = () => {
  const { values, errors } = useFormikContext<{
    data: string;
    numberOfRow: number;
  }>();

  const [field, meta, helpers] = useField("data");

  return (
    <>
      <textarea
        id="data"
        name="data"
        required
        placeholder={`[
                    {  "name": "A", "weight": 3, "value": -0.02 },
                    {  "name": "B", "weight": 3, "value": 0.05 },
                    {  "name": "C", "weight": 6, "value": 0.015 },
                    {  "name": "D", "weight": 2, "value": -0.01 },
                    {  "name": "E", "weight": 3, "value": 0.01 }
                ]`}
        className={clsx(
          "rounded-3xl border-2 px-8 py-2 bg-black min-h-[30vh]",
          errors.data
            ? "pr-10 border-red-300 text-red-500 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
            : "text-white outline-none border-white focus:ring-indigo-500 focus:border-indigo-500",
          "max-w-lg block w-full"
        )}
        onChange={(e: React.ChangeEvent<any>) => {
          const dataString = e.target.value as string;
          helpers.setValue(dataString);
        }}
        value={values.data}
        onBlur={() => helpers.setTouched(true)}
      />
      {errors.data ? (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      ) : null}
    </>
  );
};
