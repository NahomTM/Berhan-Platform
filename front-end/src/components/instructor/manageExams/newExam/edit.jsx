
// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { isAfter } from "date-fns";
// import { FaArrowCircleRight } from "react-icons/fa";
// import axios from "axios";

// const MultiStepExamForm2 = () => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});
//   const [examData, setExamData] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     const fetchCoursesAndExam = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
//         if (!accessToken) {
//           throw new Error("Access token not found");
//         }

//         // Fetch courses
//         const courseResponse = await axios.get("http://localhost:4000/exam/getCourse", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (!courseResponse.data || !Array.isArray(courseResponse.data.courses)) {
//           throw new Error("Invalid response format for courses");
//         }

//         setCourses(courseResponse.data.courses);

//         // Fetch exam
//         const examResponse = await axios.get("http://localhost:4000/exam/getExam", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (!examResponse.data) {
//           throw new Error("Invalid response format for exam");
//         }

//         setExamData(examResponse.data);

//         // Fetch questions for the exam
//         const questionResponse = await axios.post("http://localhost:4000/question/editQuestion", { examId: examResponse.data[0].id });

//         if (!questionResponse.data) {
//           throw new Error("Invalid response format for questions");
//         }

//         setFormData(questionResponse.data);
//         console.log("formData is: ", formData);

//         // Set loading state to false after all data fetching is done
//         setIsLoading(false);
//       } catch (error) {
//         toast.error(`Error fetching data: ${error.message}`);
//         setIsLoading(false); // Ensure loading state is updated even if there's an error
//       }
//     };

//     fetchCoursesAndExam();
//   }, []);

//   // Render loading indicator while data is being fetched
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
  


//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleChangeQuestion = (index, field, value) => {
//     let newQuestions = formData.questions || []; // Initialize with empty array if not already initialized
  
//     // Ensure that the questions array has the correct length
//     if (newQuestions.length !== parseInt(formData.numberOfQuestions, 10)) {
//       newQuestions = Array.from({ length: parseInt(formData.numberOfQuestions, 10) }, () => ({
//         question: "",
//         choices: ["", "", "", ""],
//         correctAnswer: "",
//       }));
//     }
  
//     if (field === "choices") {
//       // Handle updating choices, preserving existing data
//       newQuestions[index].choices = value;
//     } else {
//       // Update other fields like 'question' or 'correctAnswer'
//       newQuestions[index][field] = value;
//     }
  
//     setFormData({
//       ...formData,
//       questions: newQuestions,
//     });
//   };
  

//   const handleNext = () => {
//     if (step === 1) {
//       const { course, examName, numberOfQuestions, examCode, examDate, duration } = formData;
  
//       if (!course || !examName || !examCode || !examDate) {
//         toast.error("Please fill in all required fields.");
//         return;
//       }
  
//       const questionsNum = parseInt(numberOfQuestions, 10);
//       if (isNaN(questionsNum) || questionsNum <= 0) {
//         toast.error("Number of questions must be a positive number.");
//         return;
//       }
  
//       const examDateParsed = new Date(examDate);
//       if (!isAfter(examDateParsed, new Date())) {
//         toast.error("Exam date must be in the future.");
//         return;
//       }
  
//       if (isNaN(parseInt(duration, 10))) {
//         toast.error("Duration must be a valid number in minutes.");
//         return;
//       }
  
//       // Initialize an array of question templates
//       const newQuestions = Array.from({ length: questionsNum }, () => ({
//         question: "",
//         choices: ["", "", "", ""],
//         correctAnswer: "",
//       }));
  
//       setFormData((prevFormData) => ({ ...prevFormData, questions: newQuestions })); // Update questions array
//     }
  
//     setStep((prevStep) => prevStep + 1);
//   };
  

//   const handlePrevious = () => {
//     if (step > 1) {
//       setStep((prevStep) => prevStep - 1);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const invalidQuestion = formData.questions.some(
//       (q) =>
//         !q.question ||
//         q.choices.some((c) => c.trim() === "") ||
//         !q.correctAnswer
//     );

//     if (invalidQuestion) {
//       toast.error("Ensure all questions and choices are filled correctly.");
//       return;
//     }

//     const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    
//     const axiosConfig = {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json'
//       }
//     };
//     axios.post('http://localhost:4000/question/addQuestion', formData, axiosConfig)
//   .then(response => {
//     console.log('Form data sent successfully:', response.data);
//     // Handle success response
//   })
//   .catch(error => {
//     console.error('Error sending form data:', error);
//     // Handle error
//   });

//     console.log("Form submitted:", formData);
//     toast.success("Exam created successfully!");
//   };

//   return (
//     <div className="flex items-center justify-center py-10">
//       <div className="p-6 bg-white rounded-lg shadow-lg w-3/4 max-w-4xl">
//         <h2 className="text-2xl font-bold">Create a New Exam</h2>
//         <ToastContainer />

//         <form onSubmit={handleSubmit} className="mt-4">
//           {step === 1 && (
//             <>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Course</label>
//                 <select
//                   name="course"
//                   value={formData.course}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 >
//                   <option value="">Select a Course</option>
//                   {courses.map((course) => (
//                     <option key={course.id} value={course.id}>
//                       {course.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700">Exam Name</label>
//                 <input
//                   type="text"
//                   name="examName"
//                   value={formData.examName}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700">
//                   Number of Questions
//                 </label>
//                 <input
//                   type="number"
//                   name="numberOfQuestions"
//                   value={formData.numberOfQuestions}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700">Exam Code</label>
//                 <input
//                   type="text"
//                   name="examCode"
//                   value={formData.examCode}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 />
//               </div>

//               <div class="mb-4">
//                 <label class="block text-gray-700">Exam Date</label>
//                 <input
//                   type="date"
//                   name="examDate"
//                   value={formData.examDate}
//                   onChange={handleChange}
//                   class="w-full p-2 border border-gray-300 rounded"
//                 />
//               </div>

//               <div class="mb-4">
//                 <label class="block text-gray-700">Duration (minutes)</label>
//                 <input
//                   type="number"
//                   name="duration"
//                   value={formData.duration}
//                   onChange={handleChange}
//                   class="w-full p-2 border border-gray-300 rounded"
//                 />
//               </div>
//             </>
//           )}

//           {step > 1 && step <= formData.questions.length + 1 && (
//            <>
//            <div className="mb-4">
//              <label className="block text-gray-700">
//                Question {step - 1}
//              </label>
//              <input
//                type="text"
//                value={formData.questions[step - 2]?.question || ""}
//                onChange={(e) =>
//                  handleChangeQuestion(step - 2, "question", e.target.value)
//                }
//                className="w-full p-2 border border-gray-300 rounded"
//              />
//            </div>
         
//            <div className="mb-4">
//              <label className="block text-gray-700">Choice A</label>
//              <input
//                type="text"
//                name={`choiceA-${step - 2}`}
//                value={formData.questions[step - 2]?.choices[0] || ""}
//                onChange={(e) =>
//                  handleChangeQuestion(
//                    step - 2,
//                    "choices",
//                    [
//                      e.target.value,
//                      formData.questions[step - 2]?.choices[1],
//                      formData.questions[step - 2]?.choices[2],
//                      formData.questions[step - 2]?.choices[3],
//                    ]
//                  )
//                }
//                className="w-full p-2 border border-gray-300 rounded"
//              />
//            </div>
         
//            <div className="mb-4">
//              <label className="block text-gray-700">Choice B</label>
//              <input
//                type="text"
//                name={`choiceB-${step - 2}`}
//                value={formData.questions[step - 2]?.choices[1] || ""}
//                onChange={(e) =>
//                  handleChangeQuestion(
//                    step - 2,
//                    "choices",
//                    [
//                      formData.questions[step - 2]?.choices[0],
//                      e.target.value,
//                      formData.questions[step - 2]?.choices[2],
//                      formData.questions[step - 2]?.choices[3],
//                    ]
//                  )
//                }
//                className="w-full p-2 border border-gray-300 rounded"
//              />
//            </div>
         
//            <div className="mb-4">
//              <label className="block text-gray-700">Choice C</label>
//              <input
//                type="text"
//                name={`choiceC-${step - 2}`}
//                value={formData.questions[step - 2]?.choices[2] || ""}
//                onChange={(e) =>
//                  handleChangeQuestion(
//                    step - 2,
//                    "choices",
//                    [
//                      formData.questions[step - 2]?.choices[0],
//                      formData.questions[step - 2]?.choices[1],
//                      e.target.value,
//                      formData.questions[step - 2]?.choices[3],
//                    ]
//                  )
//                }
//                className="w-full p-2 border border-gray-300 rounded"
//              />
//            </div>
         
//            <div className="mb-4">
//              <label className="block text-gray-700">Choice D</label>
//              <input
//                type="text"
//                name={`choiceD-${step - 2}`}
//                value={formData.questions[step - 2]?.choices[3] || ""}
//                onChange={(e) =>
//                  handleChangeQuestion(
//                    step - 2,
//                    "choices",
//                    [
//                      formData.questions[step - 2]?.choices[0],
//                      formData.questions[step - 2]?.choices[1],
//                      formData.questions[step - 2]?.choices[2],
//                      e.target.value,
//                    ]
//                  )
//                }
//                className="w-full p-2 border border-gray-300 rounded"
//              />
//            </div>
         
//            <div className="mb-4">
//              <label className="block text-gray-700">Correct Answer</label>
//              <div className="flex gap-4">
//                {["A", "B", "C", "D"].map((opt, idx) => (
//                  <label key={opt} className="inline-flex items-center">
//                    <input
//                      type="radio"
//                      name={`correctAnswer-${step - 2}`}
//                      checked={
//                        formData.questions[step - 2]?.correctAnswer === opt
//                      }
//                      onChange={() => handleChangeQuestion(step - 2, "correctAnswer", opt)}
//                    />
//                    <span className="ml-2">{opt}</span>
//                  </label>
//                ))}
//              </div>
//            </div>
//          </>
         
//           )}

//           <div className="flex justify-between mt-6">
//             {step > 1 && (
//               <button
//                 type="button"
//                 className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700"
//                 onClick={handlePrevious}
//               >
//                 Previous
//               </button>
//             )}
            
//             {step < parseInt(formData.numberOfQuestions, 10) + 1 ||
//             step === 1 ? (
//               <button
//                 type="button"
//                 onClick={handleNext}
//                 className="bg-orange-400 text-white px-6 font-semibold py-2 rounded hover:bg-orange-500"
//               >
//                 Next
//               </button>
//             ) : (
              
//                 <div className="relative flex items-center border-2 border-orange-600 rounded-full px-12 cursor-pointer">
//                   <input type="submit" name="Submit" className="-ml-5 cursor-pointer"/>
//                   <div className="absolute -right-0.5 flex items-center justify-center rounded-full">
//                     <FaArrowCircleRight size={34} className="text-orange-600" />{" "}
//                   </div>
//                 </div>

//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MultiStepExamForm2;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const MultiStepExamForm = ({ examId }) => {
  const [formData, setFormData] = useState({
    course: '',
    examName: '',
    examCode: '',
    duration: '',
    numberOfQuestions: '',
    examDate: '',
    questions: []
  });

  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        const examResponse = await axios.get("http://localhost:4000/exam/getExam", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!examResponse.data) {
          throw new Error("Invalid response format for exam");
        }

        // Fetch questions for the exam
        const response = await axios.post("http://localhost:4000/question/editQuestion", { examId: examResponse.data[0].id });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching exam data:', error);
      }
    };

    fetchExamData();
  }, [examId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = formData.questions.map((question, idx) => {
      if (idx === index) {
        return { ...question, [field]: value };
      }
      return question;
    });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/update-exam/${examId}`, formData);
      alert('Exam updated successfully!');
    } catch (error) {
      console.error('Error updating exam:', error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block">Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                disabled
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Exam Name</label>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Exam Code</label>
              <input
                type="text"
                name="examCode"
                value={formData.examCode}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Number of Questions</label>
              <input
                type="text"
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Exam Date</label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
          </div>
        );
      default:
        const question = formData.questions[step - 1];
        return (
          <div className="space-y-4">
            <div>
              <label className="block">Question {step}</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(step - 1, 'question', e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            {['A', 'B', 'C', 'D'].map((choice, idx) => (
              <div key={idx}>
                <label className="block">Choice {choice}</label>
                <input
                  type="text"
                  value={question.choices[idx]}
                  onChange={(e) => handleQuestionChange(step - 1, 'choices', [
                    ...question.choices.slice(0, idx),
                    e.target.value,
                    ...question.choices.slice(idx + 1)
                  ])}
                  className="border p-2 w-full"
                />
              </div>
            ))}
            <div>
              <label className="block">Correct Answer</label>
              <div className="space-x-4">
                {['A', 'B', 'C', 'D'].map((choice, idx) => (
                  <label key={idx} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`correctAnswer-${step - 1}`}
                      value={choice}
                      checked={question.correctAnswer === choice}
                      onChange={(e) => handleQuestionChange(step - 1, 'correctAnswer', e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {renderStepContent(step)}
      <div className="flex justify-between">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
        )}
        {step < formData.questions.length ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};

export default MultiStepExamForm;

