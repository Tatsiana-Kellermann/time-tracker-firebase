import React, { useState, useEffect } from 'react';
import './style/style.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from "firebase/firestore";

const TimeTracker = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [mondayHours, setMondayHours] = useState(0);
  const [tuesdayHours, setTuesdayHours] = useState(0);
  const [wednesdayHours, setWednesdayHours] = useState(0);
  const [thursdayHours, setThursdayHours] = useState(0);
  const [fridayHours, setFridayHours] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [entries, setEntries] = useState([]);
  const [weeklyReport, setWeeklyReport] = useState({});

  useEffect(() => {
    const fetchEntries = async () => {
      const querySnapshot = await getDocs(collection(db, "entries"));
      const fetchedEntries = [];
      let fetchedTotalHours = 0;
      const fetchedWeeklyReport = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedEntries.push(data);
        fetchedTotalHours += data.hoursWorked;

        fetchedWeeklyReport[data.employeeName] = {
          Monday: data.mondayHours,
          Tuesday: data.tuesdayHours,
          Wednesday: data.wednesdayHours,
          Thursday: data.thursdayHours,
          Friday: data.fridayHours,
          Total: data.hoursWorked
        };
      });

      setEntries(fetchedEntries);
      setTotalHours(fetchedTotalHours);
      setWeeklyReport(fetchedWeeklyReport);
    };

    fetchEntries();
  }, []);

  const resetForm = () => {
    setEmployeeName('');
    setMondayHours(0);
    setTuesdayHours(0);
    setWednesdayHours(0);
    setThursdayHours(0);
    setFridayHours(0);
  };

  const handleAddEntry = async () => {
    if (employeeName && (mondayHours || tuesdayHours || wednesdayHours || thursdayHours || fridayHours)) {
      const totalHoursForWeek = mondayHours + tuesdayHours + wednesdayHours + thursdayHours + fridayHours;

      const newEntry = {
        employeeName,
        mondayHours,
        tuesdayHours,
        wednesdayHours,
        thursdayHours,
        fridayHours,
        hoursWorked: totalHoursForWeek,
      };

      try {
        await addDoc(collection(db, "entries"), newEntry);

        setEntries([...entries, newEntry]);

        const updatedReport = { ...weeklyReport };
        updatedReport[employeeName] = {
          Monday: mondayHours,
          Tuesday: tuesdayHours,
          Wednesday: wednesdayHours,
          Thursday: thursdayHours,
          Friday: fridayHours,
          Total: totalHoursForWeek,
        };

        setWeeklyReport(updatedReport);
        setTotalHours(totalHours + totalHoursForWeek);
        resetForm();
      } catch (e) {
        console.error("Ошибка при добавлении документа: ", e);
      }
    } else {
      alert('Пожалуйста, введите корректные данные');
    }
  };

  const handleViewReport = (employeeName) => {
    const report = weeklyReport[employeeName];
    if (report) {
      alert(`${employeeName}'s отчет за неделю:\n
        Понедельник: ${report.Monday} часов\n
        Вторник: ${report.Tuesday} часов\n
        Среда: ${report.Wednesday} часов\n
        Четверг: ${report.Thursday} часов\n
        Пятница: ${report.Friday} часов\n
        Всего: ${report.Total} часов`);
    } else {
      alert('Отчет для этого пользователя не найден.');
    }
  };

  return (
    <div className='time-tracker-container'>
      <h2 className='time-tracker-header'>Time Tracker</h2>
      <div className='form-input'>
        <input
          type="text"
          placeholder="Имя сотрудника"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <div className='form-input'>
          <label>Понедельник:</label>
          <input
            type="number"
            value={mondayHours}
            onChange={(e) => setMondayHours(parseFloat(e.target.value))}
          />
        </div>
        <div className='form-input'>
          <label>Вторник:</label>
          <input
            type="number"
            value={tuesdayHours}
            onChange={(e) => setTuesdayHours(parseFloat(e.target.value))}
          />
        </div>
        <div className='form-input'>
          <label>Среда:</label>
          <input
            type="number"
            value={wednesdayHours}
            onChange={(e) => setWednesdayHours(parseFloat(e.target.value))}
          />
        </div>
        <div className='form-input'>
          <label>Четверг:</label>
          <input
            type="number"
            value={thursdayHours}
            onChange={(e) => setThursdayHours(parseFloat(e.target.value))}
          />
        </div>
        <div className='form-input'>
          <label>Пятница:</label>
          <input
            type="number"
            value={fridayHours}
            onChange={(e) => setFridayHours(parseFloat(e.target.value))}
          />
        </div>
        <button className='button' onClick={handleAddEntry}>Добавить запись</button>
      </div>
      <div>
        <h3>Записи</h3>
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>
              {entry.employeeName} - {entry.hoursWorked} часов
            </li>
          ))}
        </ul>
        <p>Общее количество часов: {totalHours}</p>
      </div>
      <div>
        <h3>Отчет за неделю</h3>
        <ul>
          {Object.keys(weeklyReport).map((name, index) => (
            <li key={index}>
              <button onClick={() => handleViewReport(name)}>
                Отчет {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeTracker;