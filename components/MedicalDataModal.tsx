"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";
import { AppointmentModal } from "./AppointmentModal";

export const MedicalDataModal = ({
  appointment,
}: {
  appointment?: Appointment;
  //   title: string;
  //   description: string;
}) => {
  const [open, setOpen] = useState(false);
  const [aggregateVitaData, setAggregateVitaData] = useState(null);

  useEffect(() => {
    if (appointment?.patient?.currentMedication) {
      try {
        console.log("appointment:", appointment);
        setAggregateVitaData(JSON.parse(appointment.patient.currentMedication));
      } catch (error) {
        console.error("Failed to parse currentMedication data:", error);
      }
    }
  }, [appointment]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
        >
          📁
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-6xl max-h-[700px] overflow-auto">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{appointment?.patient.name} 's Pre submitted data for Appointment</DialogTitle>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              className={`capitalize`}
            >
              <span className="px-6 pl-32">Appointment requested for : {appointment?.primaryPhysician} </span>| 
              <span className="px-6">Date: {new Date(appointment?.schedule).toLocaleString()} </span>
            </Button>

            <AppointmentModal
              type="schedule"
              patientId={appointment?.patient?.$id || ""}
              userId={appointment?.userId || ""}
              appointment={appointment}
            />
            <AppointmentModal
              type="cancel"
              patientId={appointment?.patient.$id || ""}
              userId={appointment?.userId || ""}
              appointment={appointment}
            />
          </div>
          <DialogDescription>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">

                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    <tr>
                      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">reported and current</td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">{appointment?.patient.allergies}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">Vital Signs</td>
                      {/* <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">{appointment?.patient.currentMedication}</td> */}
                      {appointment?.patient.currentMedication && (
                        <div className="mt-4">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parameter</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">1D</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">7D</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">30D</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">90D</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">180D</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">360D</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300">
                              {/* BP Systolic */}
                              <tr>
                                <td className="px-4 py-2 font-medium text-gray-700">BP Sys ( {aggregateVitaData?.bpSysUom})</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpSys1DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpSys7DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpSys30DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpSys90DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpSys180DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpSys360DayAvg}</td>
                              </tr>

                              {/* BP Diastolic */}
                              <tr>
                                <td className="px-4 py-2 font-medium text-gray-700">BP Dia  ( {aggregateVitaData?.bpDiaUom})</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpDia1DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpDia7DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpDia30DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpDia90DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpDia180DayAvg}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpDia360DayAvg}</td>
                              </tr>

                              {/* Trends */}
                              <tr>
                                <td className="px-4 py-2 font-medium text-gray-700">Trends</td>
                                <td className="px-0 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpSys1DayTrend || "-"}</td>
                                <td colSpan="6" className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.bpDia1DayTrend || "-"}</td>
                              </tr>

                              {/* Weight and BMI */}
                              <tr>
                                <td colSpan="7" className="px-4 py-2 bg-gray-200"></td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 font-medium text-gray-700">Weight (lbs)</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.weightDailyAvgLbs}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700"></td>
                                <td className="px-4 py-2 font-medium text-gray-700">BMI</td>
                                <td colSpan="6" className="px-4 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.currBmiValue}</td>
                              </tr>

                              {/* Misc */}
                              <tr>
                                <td className="px-4 py-2 font-medium text-gray-700">Measured at :</td>
                                <td className="px-0 py-2 whitespace-normal text-sm text-gray-700">{aggregateVitaData?.organizationId}</td>
                                <td className="px-4 py-2 whitespace-normal text-sm text-gray-700"></td>
                                <td colSpan="3" className="px-4 py-2 font-medium text-gray-700">Aggregation Date</td>
                                <td colSpan="3" className="px-4 py-2 whitespace-normal text-sm text-gray-700">
                                  {new Date(aggregateVitaData?.aggregationDate).toLocaleDateString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">Family Member History</td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                        {appointment?.patient?.familyMedicalHistory && JSON.parse(appointment.patient.familyMedicalHistory).map((member, index) => (
                          <div key={index}>
                            <div className="font-medium text-gray-900">{member.name} ({member.relation})</div>
                            <table className="min-w-full divide-y divide-gray-300 mt-2">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Disease</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Severity</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">First Occurrence</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-300">
                                {member?.disease?.map((disease, idx) => (
                                  <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">{disease.diseaseName}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">{disease.severity}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">{disease.description}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">{new Date(disease.firstOccuranceDate).toLocaleDateString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </td>
                    </tr>
               
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Vital Signs Graph</h3>
                {/* Replace with your graph component */}
                <div className="mt-4">
                  <img src="/path-to-your-graph.png" alt="Vital Signs Graph" />
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>


      </DialogContent>
    </Dialog>
  );
};
