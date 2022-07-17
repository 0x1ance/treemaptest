import React from "react";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { Formik, useFormik, useFormikContext } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { TreemapDataInput } from "./TreemapDataInput.component";
import {
  TreemapDatapointType,
  TreemapGeneratorMenuEnum,
  useTreemapGeneratorContext,
} from "../context/TreemapGenerator.context";

export const TreemapInputForm = () => {
  const { setTreemapData, setActiveMenu } = useTreemapGeneratorContext();
  const handleSubmit = useCallback(
    async ({ data, numberOfRow }: { data: string; numberOfRow: number }) => {
      const parsedArray = JSON.parse(data) as TreemapDatapointType[];
      setTreemapData({
        data: parsedArray,
        numberOfRow,
      });
      setActiveMenu(TreemapGeneratorMenuEnum.TreemapView);
    },
    []
  );

  const GenerateTreemapFormSchema = useMemo(
    () =>
      Yup.object().shape({
        data: Yup.string()
          .required()
          .test("isValidJson", "Input JSON is invalid", (str) => {
            try {
              JSON.parse(str!);
            } catch (e) {
              return false;
            }
            return true;
          })
          .test("isArrayOfJson", "Input Json must be an array", (str) => {
            try {
              const parsedArray = JSON.parse(str!);

              return Array.isArray(parsedArray);
            } catch (e) {
              return false;
            }
          })
          .test(
            "hasValidArrayLength",
            "The Input Json array length must be equal or less than 50",
            (str) => {
              try {
                const parsedArray = JSON.parse(str!);

                return parsedArray.length <= 50;
              } catch (e) {
                return false;
              }
            }
          )
          .test(
            "validNameField",
            "name field must be string and less than 50 characters",
            (str) => {
              try {
                const parsedArray = JSON.parse(str!);

                for (let i = 0; i < parsedArray.length; i++) {
                  const currentDatapoint = parsedArray[i];
                  if (
                    !currentDatapoint["name"] ||
                    typeof currentDatapoint["name"] !== "string" ||
                    currentDatapoint["name"].length > 50
                  ) {
                    return false;
                  }
                }
                return true;
              } catch (e) {
                return false;
              }
            }
          )
          .test("validWeightField", "weight field must be integer", (str) => {
            try {
              const parsedArray = JSON.parse(str!);

              for (let i = 0; i < parsedArray.length; i++) {
                const currentDatapoint = parsedArray[i];
                if (
                  !currentDatapoint["weight"] ||
                  typeof currentDatapoint["weight"] !== "number" ||
                  !Number.isInteger(currentDatapoint["weight"])
                ) {
                  return false;
                }
              }
              return true;
            } catch (e) {
              return false;
            }
          })
          .test("validValueField", "value field must be number", (str) => {
            try {
              const parsedArray = JSON.parse(str!);

              for (let i = 0; i < parsedArray.length; i++) {
                const currentDatapoint = parsedArray[i];
                if (
                  !currentDatapoint["value"] ||
                  typeof currentDatapoint["value"] !== "number"
                ) {
                  return false;
                }
              }
              return true;
            } catch (e) {
              return false;
            }
          }),
        numberOfRow: Yup.number()
          .integer()
          .required()
          .positive()
          .max(50)
          .test(
            "lengthValidation",
            "row number must be equal or less than the total number of datapoints in the json",
            (val, ctx) => {
              if (!val) return false;
              const currentDataJson = ctx.parent.data as string;
              if (!currentDataJson) return false;
              try {
                const parsedArray = JSON.parse(currentDataJson);

                if (!Array.isArray(parsedArray)) return false;

                return val <= parsedArray.length;
              } catch (e) {
                return false;
              }
            }
          ),
      }),
    []
  );

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="pb-6 text-lg tracking-loose">Lance Tsang</div>
      <h2 className="pb-4 text-4xl lg:text-5xl font-bold">Treemap Generator</h2>
      <h3 className="text-base font-bold">
        input json array to generate a treemap
      </h3>
      <Formik
        initialValues={{
          data: `[
            {  "name": "A", "weight": 3, "value": -0.02 },
            {  "name": "B", "weight": 3, "value": 0.05 },
            {  "name": "C", "weight": 6, "value": 0.015 },
            {  "name": "D", "weight": 2, "value": -0.01 },
            {  "name": "E", "weight": 3, "value": 0.01 }
        ]`,
          numberOfRow: 1,
        }}
        validationSchema={GenerateTreemapFormSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-16 px-10 lg:mt-12 min-w-full lg:min-w-[500px] justify-center items-center"
          >
            <div className="relative w-full flex justify-center">
              <TreemapDataInput />
            </div>

            {errors.data ? (
              <p className="text-center text-sm text-red-600" id="email-error">
                {errors.data}
              </p>
            ) : null}
            <div className="relative mt-4 w-full flex justify-center">
              <input
                id="numberOfRow"
                name="numberOfRow"
                required
                type={"number"}
                placeholder="Number of Row"
                className={clsx(
                  "rounded-3xl border-2 px-8 py-2 bg-black",
                  errors.numberOfRow
                    ? "pr-10 border-red-300 text-red-500 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    : "text-white outline-none border-white focus:ring-indigo-500 focus:border-indigo-500",
                  "max-w-lg block w-full"
                )}
                onChange={handleChange}
                value={values.numberOfRow}
                onBlur={handleBlur}
              />
              {errors.numberOfRow ? (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              ) : null}
            </div>
            {errors.numberOfRow ? (
              <p className="text-center text-sm text-red-600" id="email-error">
                {errors.numberOfRow}
              </p>
            ) : null}

            <div className="text-center mt-10">
              <button
                disabled={!touched}
                type="submit"
                className="bg-white text-black rounded-3xl px-8 py-2"
              >
                Generate Treemap
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
