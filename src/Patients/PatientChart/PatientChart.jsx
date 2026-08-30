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
        } else if (encounterId) {
          const res = await PatientChartAPI.getChartByEncounter(patientId, encounterId);
          data = res.data;
        }
        
        // If no chart or no appointmentId/encounterId, fetch snapshot
        if (!data) {
          const res = await PatientChartAPI.getPatientSnapshot(patientId, encounterId);
          data = res.data;
        }
        
        setChartData(data);
        
        // Fetch header specifically for the patient data layout
        const headerRes = await PatientChartAPI.getPatientHeader(patientId);
        if (headerRes.data) {
          setPatientData(headerRes.data);
        } else {
          // Fallback if not found
          setPatientData({
            name: 'Unknown',
            gender: '-',
            dob: '-',
            age: '-',
            weight: '-',
            height: '-',
            bmi: '-',
            bloodGroup: '-',
            allergies: '',
            chronicConditions: '',
            riskFactors: '',
            insurance: 'None',
            lastVisit: "--",
            nextVisit: "--"
          });
        }
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
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      <ChartHeader patientData={patientData} onBack={onBack} />
      <div className="flex flex-1 overflow-hidden">
        <ChartLeftSidebar patientId={patientId} patientData={patientData} />
        <ChartMainBody patientId={patientId} appointmentId={appointmentId} encounterId={encounterId} initialData={chartData} />
        <ChartRightSidebar patientId={patientId} patientData={patientData} initialData={chartData} />
      </div>
    </div>
  );
};

export default PatientChart;
