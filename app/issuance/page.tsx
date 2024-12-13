"use client";
import React, { useEffect, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { useForm } from "react-hook-form";
import { StartIssuanceInputClaimModeEnum } from "@affinidi-tdk/credential-issuance-client";
import { VaultUtils } from "@affinidi-tdk/common";
import { OfferPayload } from "@/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const bpAggregateData = {
  vitalAggregateID: "123456",
  aggregationDate: "2024-12-09",
  measurementType: "Blood Pressure",
  organizationId: "Org001",
  user: {
    userId: "user123",
    name: "John Doe",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "1234567890",
    heightInch: "72",
    emergencyContacts: [
      {
        name: "Jane Doe",
        phone: "0987654321",
        email: "jane.doe@example.com",
        relation: "Spouse",
      },
    ],
  },
  currentConditions: [
    {
      conditionId: "cond1",
      name: "Hypertension",
      description: "High blood pressure",
      severity: "High",
    },
  ],
  currBmiValue: 24.5,
  weightDailyAvgLbs: 170.0,
  bpSysUom: "mmHg",
  bpDiaUom: "mmHg",
  bpSys1DayTrend: "Stable",
  bpDia1DayTrend: "Stable",
  bpSys1DayAvg: 120.0,
  bpDia1DayAvg: 80.0,
  bpSys7DayAvg: 118.0,
  bpDia7DayAvg: 78.0,
  bpSys30DayAvg: 115.0,
  bpDia30DayAvg: 75.0,
  bpSys90DayAvg: 117.0,
  bpDia90DayAvg: 77.0,
  bpSys180DayAvg: 119.0,
  bpDia180DayAvg: 79.0,
  bpSys360DayAvg: 121.0,
  bpDia360DayAvg: 81.0,
};
const familyMedicalHistory = {
  patient: {
    userId: "user123",
    name: "John Doe",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "1234567890",
  },
  familyMembers: [
    {
      name: "Jane Doe",
      relation: "Spouse",
      conditions: [
        {
          conditionId: "cond2",
          name: "Diabetes",
          description: "High blood sugar levels",
          severity: "Medium",
          firstOccuranceDate: "2015-06-01",
        },
        {
          conditionId: "cond3",
          name: "Asthma",
          description: "Respiratory condition",
          severity: "Low",
          firstOccuranceDate: "2010-09-15",
        },
      ],
    },
    {
      name: "Michael Doe",
      relation: "Father",
      conditions: [
        {
          conditionId: "cond4",
          name: "Heart Disease",
          description: "Cardiovascular condition",
          severity: "High",
          firstOccuranceDate: "2000-01-20",
        },
        {
          conditionId: "cond5",
          name: "Arthritis",
          description: "Joint inflammation",
          severity: "Medium",
          firstOccuranceDate: "2012-03-10",
        },
      ],
    },
    {
      name: "Sarah Doe",
      relation: "Mother",
      conditions: [
        {
          conditionId: "cond6",
          name: "Osteoporosis",
          description: "Bone density loss",
          severity: "Medium",
          firstOccuranceDate: "2018-07-22",
        },
        {
          conditionId: "cond7",
          name: "Thyroid Disorder",
          description: "Thyroid gland issues",
          severity: "Low",
          firstOccuranceDate: "2011-11-05",
        },
      ],
    },
  ],
};
const labReportData = {
  patient: {
    userId: "user123",
    name: "John Doe", 
  }
}
const Issuance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [vaultLink, setVaultLink] = useState("");
  const [txCode, setTxCode] = useState("");
  const [issuanceResponse, setIssuanceResponse] = useState<OfferPayload>();

  const form = useForm({
    defaultValues: {},
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);

    const patient = {
      name: values.name,
    };
    console.log("onSubmit called", patient);

    //Call API to start VC issuance
    const response = await fetch("/api/issuance/start", {
      method: "POST",
      body: JSON.stringify({
        bpAggregateData,
        credentialTypeId: "AHC Vitals Aggregate",
        claimMode: StartIssuanceInputClaimModeEnum.TxCode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false);
    if (!response.ok) {
      console.log("Error in issuing credential");
      return;
    }

    let dataResponse = await response.json();
    console.log("dataResponse", dataResponse);

    //Generate claim link to affinidi vault from offer URL
    if (dataResponse.credentialOfferUri) {
      const vaultLink = VaultUtils.buildClaimLink(
        dataResponse.credentialOfferUri
      );
      setVaultLink(vaultLink);
      setTxCode(dataResponse.txCode || "");
      setIssuanceResponse(dataResponse);
    }
    console.log("issuanceResponse", issuanceResponse);
  };

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container flex-1 flex-col py-10">
        <div className="sub-container max-w-[860px]">
          {!issuanceResponse && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 space-y-12"
            >
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="flex-1">
                <SubmitButton isLoading={isLoading}>
                Issue Aggregate Vital VC
                </SubmitButton>
                <pre>{JSON.stringify(bpAggregateData, null, 2)}</pre>
              </div>

              <div className="flex-1">
                <SubmitButton isLoading={isLoading}>
                Issue Family Medical History VC
                </SubmitButton>
                <pre>{JSON.stringify(familyMedicalHistory, null, 2)}</pre>
              </div>

              <div className="flex-1">
                <SubmitButton isLoading={isLoading}>
                Issue Lab Report VC
                </SubmitButton>
                <pre>{JSON.stringify(labReportData, null, 2)}</pre>
              </div>
              </div>
            </form>
          )}

          {issuanceResponse && (
            <>
              <h2 className="header mb-6 max-w-[600px] text-center">
                Your{" "}
                <span className="text-green-500">Health Vitals Credential </span>
                has been issued successfully! <br/> Click link or button to Claim it.
              </h2>
              <section className="request-details">
                <p>Offer URL:</p>
                <div className="flex items-center gap-3">
                  <p>{decodeURIComponent(vaultLink)}</p>
                </div>
              </section>
              {txCode && (
                <section className="request-details">
                  <p>Transaction Code:</p>
                  <div className="flex items-center gap-3">
                    <p>{txCode}</p>
                  </div>
                </section>
              )}

              <Button variant="outline" className="shad-primary-btn" asChild>
                <Link href={vaultLink} target="_blank">
                  Claim Your VC
                </Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Issuance;
