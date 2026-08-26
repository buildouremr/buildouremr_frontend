import React, { useState, useEffect } from 'react';
import ChartHeader from './ChartHeader';
import ChartLeftSidebar from './ChartLeftSidebar';
import ChartMainBody from './ChartMainBody';
import ChartRightSidebar from './ChartRightSidebar';

import PatientChartAPI from '../API/patientChartAPI';

const PatientChart = ({ patientId, appointmentId, encounterId, onBack }) => {
  const [patientData, setPatientData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        let data = null;
        if (appointmentId) {
          const res = await PatientChartAPI.getChart(appointmentId);
          data = res.data;
        }
        
        // If no chart or no appointmentId, fetch snapshot
        if (!data) {
          const res = await PatientChartAPI.getPatientSnapshot(patientId);
          data = res.data;
        }
        
        setChartData(data);
        
        // Map DTO to UI format
        setPatientData({
          name: data.patientName || 'Unknown',
          gender: data.patientGender || '-',
          dob: data.patientDob || '-',
          age: data.patientAge || '-',
          weight: data.patientWeight || '-',
          height: data.patientHeight || '-',
          bmi: data.patientBmi || '-',
          bloodGroup: data.patientBloodGroup || '-',
          allergies: data.patientAllergies || '',
          chronicConditions: data.patientChronicConditions || '',
          riskFactors: data.patientRiskFactors || '',
          insurance: data.patientInsurance || 'None',
          lastVisit: "12 May 2024", // Hardcoded for UI layout as API doesn't have it yet
          nextVisit: "15 Jun 2024"  // Hardcoded for UI layout as API doesn't have it yet
        });
      } catch (err) {
        console.error("Error fetching patient chart data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchChartData();
    }
  }, [patientId, appointmentId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl text-gray-500">Loading Patient Chart...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      <ChartHeader patientData={patientData} onBack={onBack} />
      <div className="flex flex-1 overflow-hidden gap-6 p-6">
        <ChartLeftSidebar patientId={patientId} patientData={patientData} />
        <ChartMainBody patientId={patientId} appointmentId={appointmentId} encounterId={encounterId} initialData={chartData} />
        <ChartRightSidebar patientId={patientId} patientData={patientData} initialData={chartData} />
      </div>
    </div>
  );
};

export default PatientChart;
