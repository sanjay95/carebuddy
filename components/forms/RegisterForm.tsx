"use client";

import CustomFormfield from "@/components/CustomFormfield";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import {
  Department,
  PatientFormDefaultValues,
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";
import useIotaQuery from "@/lib/hooks/useIotaQuery";
import { iotaConfigId, aggregateHealthDataQueryId } from "@/lib/variables";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isHealthDataLoading, setIsHealthDataLoading] = useState(false);
  const [healthVitalData, sethealthVitalData] = useState<string>();
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState<string>();
  const [insurnceCertificate, setInsuranceCertificate] = useState<string>();
  const {
    isInitializing,
    isWaitingForResponse,
    handleInitiate,
    errorMessage,
    data: iotaRequestData,
    dataRequest,
  } = useIotaQuery({ configurationId: iotaConfigId });

  const [selectedDepartment, setSelectedDepartment] = useState("")

  const label = healthVitalData
  ? "We have selected medical department for you based on your health data. Feel free to change it."
  : "Select Field of Care";

const labelClass = healthVitalData
  ? "text-green-500 font-semibold"
  : "text-gray-700";

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      // email: user.email,
      phone: user.phone,
    },
  });


  useEffect(() => {
    if (healthVitalData) {
      setSelectedDepartment("Cardiology");
      const currentConditions = healthVitalData.currentConditions
        .map((condition: { description: string }) => condition.description)
        .join(", ");
      const latestVital = `       Latest of: ${healthVitalData.aggregationDate}      | from: ${healthVitalData.organizationId}
                    BMI: ${healthVitalData.currBmiValue}          Weight Daily Avg (lbs): ${healthVitalData.weightDailyAvgLbs}
             BP Sys UOM: ${healthVitalData.bpSysUom}          /   BP Dia UOM: ${healthVitalData.bpDiaUom}
          1 Day Trend Sys: ${healthVitalData.bpSys1DayTrend}  /   Dia: ${healthVitalData.bpDia1DayTrend}
          1 Day Avg Sys: ${healthVitalData.bpSys1DayAvg}      /   Dia: ${healthVitalData.bpDia1DayAvg}
          7 Day Avg Sys: ${healthVitalData.bpSys7DayAvg}      /   Dia: ${healthVitalData.bpDia7DayAvg}
          30 Day Avg Sys: ${healthVitalData.bpSys30DayAvg}    /   Dia: ${healthVitalData.bpDia30DayAvg}
          90 Day Avg Sys: ${healthVitalData.bpSys90DayAvg}    /   Dia: ${healthVitalData.bpDia90DayAvg}
          180 Day Avg Sys: ${healthVitalData.bpSys180DayAvg}  /   Dia: ${healthVitalData.bpDia180DayAvg}
          360 Day Avg Sys: ${healthVitalData.bpSys360DayAvg}  /   Dia: ${healthVitalData.bpDia360DayAvg}
        `;
      const familyHistory = healthVitalData.familyHistory
        .map((member: { relation: string; disease: { diseaseName: string; severity: string; firstOccuranceDate: string }[] }) =>
          member.disease
            .map(disease => `${member.relation} | ${disease.diseaseName} | ${disease.severity} | ${disease.firstOccuranceDate}`)
            .join("\n")
        )
        .join("\n");

      form.reset({
        ...PatientFormDefaultValues,
        name: healthVitalData.user.name,
        phone: healthVitalData.user.phone,
        gender: healthVitalData.user.gender,
        allergies: currentConditions,
        currentMedication: latestVital,
        familyMedicalHistory: familyHistory,
      });
    }
  }, [healthVitalData]);

  const handlePersonalInformationFetch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsHealthDataLoading(true);
    handleInitiate(aggregateHealthDataQueryId);
  }

  useEffect(() => {
    if (!iotaRequestData) return;

    const healthVitalData = iotaRequestData[aggregateHealthDataQueryId];
    if (healthVitalData) {
      setIsHealthDataLoading(false);
      const data = JSON.stringify(healthVitalData, null, 2);
      sethealthVitalData(JSON.parse(data));
      localStorage.setItem("healthVitalData", data);
      localStorage.setItem(
        "verifiablePresentation",
        JSON.stringify(dataRequest.response.verifiablePresentation, null, 2)
      );
    }
  }, [iotaRequestData]);

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    console.log("onSubmit called")
    console.log(" healthVitalData.familyHistory",  JSON.stringify(healthVitalData?.familyHistory, null, 2));
    let formData;
    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: user.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: "other" as Gender,
        address: "",
        occupation: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: "",
        insurancePolicyNumber: "",
        allergies: values.allergies,
        currentMedication: healthVitalData ? JSON.stringify({ ...healthVitalData, familyHistory: undefined }, null, 2) : "",
        familyMedicalHistory: healthVitalData ? JSON.stringify(healthVitalData?.familyHistory, null, 2) : "",
        pastMedicalHistory: "",
        identificationType: "",
        identificationNumber: "",
        identificationDocument: undefined,//values.identificationDocument
        // ? formData
        // : undefined,
        privacyConsent: true,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/new-appointment/?patientId=${newPatient.$id}`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h2 className="sub-header">Schedule with Ease, Heal with Care</h2>
          <p className="text-dark-700">
            <>
              {/* {user.email == "guest@example.com" && <>You have chosen to continue as a <strong>guest.</strong></>} */}
              Please provide these details to help us serve you better.
            </>
          </p>
        </section>

        <section className="space-y-6">
          {/* <div className="mb-9 space-y-1"> */}
          <h4 className="sub-sub-header">Personal Information</h4>
          {/* </div> */}

          {/* EMAIL & PHONE */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormfield
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              placeholder="John Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
              label="Name"
            />
            <CustomFormfield
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="(555) 123-4567"
            />

            <CustomFormfield
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h4 className="sub-sub-header">Medical Information</h4>
            <button className="text-green-500" onClick={handlePersonalInformationFetch}>
              You can fill these details from your health vault. Click here
            </button>
            {isHealthDataLoading && (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-blue-500"> please wait...</p>
              </div>
            )}
          </div>





          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Current conditions"
              placeholder="Please describe your current health concerns to help us prepare for your visit. Also fill these details below."
            />

            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Latest Vital Data"
              placeholder="Blood pressure, heart rate, temperature"
            />
          </div>

          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Father has hypertension"
            />

            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Lab results, past medical history"
              placeholder="High cholesterol, diabetes"
            />
          </div>
        </section>

        {/* PRIMARY CARE PHYSICIAN */}
        
        <CustomFormfield
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label={label}
          labelClass={labelClass}
          placeholder="Departments"
          value={selectedDepartment}
          onValueChange={setSelectedDepartment} // Handle change
        >
          {Department.map((department, i) => (
            <SelectItem key={department.name + i} value={department.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={department.image}
                  width={32}
                  height={32}
                  alt="department"
                  className="rounded-full border border-dark-500 bg-white"
                />
                <p> <strong> {department.name}  </strong> </p>
              </div>
            </SelectItem>
          ))}
        </CustomFormfield>

        {/* INSURANCE & POLICY NUMBER */}
        {insurnceCertificate &&
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormfield
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />

            <CustomFormfield
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>
        }

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormfield
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="combinedConsent"
            label="I consent to receive treatment for my health condition, the use and disclosure of my health information for treatment purposes, and I acknowledge that I have reviewed and agree to the privacy policy."
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and Continue {isLoading}</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;