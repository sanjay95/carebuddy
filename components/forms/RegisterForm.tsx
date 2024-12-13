"use client";

import CustomFormfield from "@/components/CustomFormfield";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  Department,
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { FileUploader } from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";
import Link from "next/link";
import useIotaQueryKyc from "@/lib/hooks/useIotaQueryKYC";
import { idvQueryId, iotaConfigId, aggregateHealthDataQueryId } from "@/lib/variables";

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
  } = useIotaQueryKyc({ configurationId: iotaConfigId });

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
      form.reset({
        ...PatientFormDefaultValues,
        name: healthVitalData.user.name,
        phone: healthVitalData.user.phone,
        gender: healthVitalData.user.gender
      });
    }
    console.log("** healthVitalData **", healthVitalData);
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
        allergies: "",
        currentMedication: "",
        familyMedicalHistory: "",
        pastMedicalHistory: "",
        identificationType: "",
        identificationNumber: "",
        identificationDocument: undefined ,//values.identificationDocument
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
              <p className="text-blue-500 animate-pulse">Please wait ...</p>
            )}
          </div>

        



          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              // label="Please describe your current health concerns to help us prepare for your visit. Also fill these details below."
              placeholder="Please describe your current health concerns to help us prepare for your visit. Also fill these details below."
            />

            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              // label="Current medications"
              placeholder="Current medications"
            />
          </div>

          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              // label=" Family medical history (if relevant)"
              placeholder="Family medical history (if relevant)"
            />

            <CustomFormfield
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              // label="Past medical history"
              placeholder="Past medical history"
            />
          </div>
        </section>

          {/* PRIMARY CARE PHYSICIAN */}
          <CustomFormfield
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Select Department & Physician"
            placeholder="Department & Physician"
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
                  <p> <strong> {department.name}  </strong> {'     ( ' + department.doctors + ' )'}</p>
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