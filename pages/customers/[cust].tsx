import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, CardBody, Input, Label, Textarea } from '@roketid/windmill-react-ui';
import API from '../app/API';
import Loading from '../components/loading';
import { useRouter } from 'next/router';
import CryptoJS from "crypto-js";

interface CustomerAbstract {
  name: string,
  position: string,
  comments: string
}

interface AnswerAbstract {
  id: number;
  answer: number;
}
interface InstanceAbstract {
  id: number,
  name: string
}


interface QuestionAbstract {
  id: number,
  question: string
}

interface QuestionerAbstract {
  value: number,
  question: QuestionAbstract

}

interface isSubmitedAbstract {
  success: boolean
}
// {
//   "name": "test",
//     "questioner": [
//       {
//         "value": 4,
//         "question": {
//           "id": 2
//         }
//       }
//     ],
//       "instance": "string"
// }


const Form = ({ name, position, onNameChange, onPositionChange }: any) => (
  <form className='flex flex-col gap-4'>
    <Label className='dark:text-gray-700 text-gray-700'>
      <span>Name</span>
      <Input className="mt-1 dark:bg-white  dark:text-gray-800 dark:border-gray-400 text-gray-800 border-gray-800" onChange={(e) => onNameChange(e.target.value)} value={name} crossOrigin={undefined} />
    </Label>
    <Label className='dark:text-gray-700 text-gray-700'>
      <span>Position</span>
      <Input className="mt-1 dark:bg-white dark:text-gray-800 dark:border-gray-400" onChange={(e) => onPositionChange(e.target.value)} value={position} crossOrigin={undefined} />
    </Label>
  </form>
)
const Comments = ({ comments, onCommentsChanged }: any) => {
  return <Label>
    <span className='text-gray-700'>Additional Comments</span>
    <Textarea onChange={(e) => onCommentsChanged(e.target.value)} value={comments} className="mt-1 dark:bg-white text-gray-800 border-gray-800 dark:text-gray-800 dark:border-gray-800 resize-none" rows={6} placeholder="Enter your comments..." />
  </Label>
}

const Home: NextPage = ({ cust }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<CustomerAbstract>({ name: "", position: "", comments: "" })
  const [message, setMessage] = useState("");
  const [questioner, setQuestioner] = useState<QuestionerAbstract[]>([]);
  const [question, setQuestion] = useState<QuestionAbstract[]>([])
  const [indexQuestion, setIndexQuestion] = useState(-1);
  const [isPrevious, setIsPrevious] = useState(indexQuestion != 0);
  const [isNext, setIsNext] = useState(indexQuestion != question.length - 1 || indexQuestion == -1);
  const [isSubmited, setIsSubmited] = useState<isSubmitedAbstract>()
  const [instance, setInstance] = useState<InstanceAbstract>();
  useEffect(() => {
    setIsLoading(true)


    const chiperText = cust?.toString().replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=').toString() || "";
    const bytes = CryptoJS.AES.decrypt(chiperText, process.env.KEY || "MERDEKA1945");
    const str = bytes.toString(CryptoJS.enc.Utf8)
    if (!str)
      return window.location.replace("/404");

    const data = JSON.parse(str);

    if (!data)
      return window.location.replace("/404");

    setInstance(data)

    API.get("question").then(res => {
      setQuestion(res.data);
      setIsLoading(false)
    }).catch(e => console.log(e))



  }, [])

  useEffect(() => {
    checkNextPrevious();
  }, [customer, indexQuestion, questioner])


  const checkNextPrevious = () => {
    if (indexQuestion == -1) {
      if (!customer.name || !customer.position) {
        setIsNext(false);
      } else {
        setIsNext(true);
      }
      return;
    }
    if (indexQuestion == question.length)
      setIsNext(true);
    else {
      if (questioner[indexQuestion]?.value)
        setIsNext(true)
      else
        setIsNext(false)
    }
    setIsPrevious(indexQuestion != -1)
  }

  const handleQuestion = (newQuestioner: QuestionerAbstract) => {
    const data = [...questioner];
    const index = data.findIndex((answer) => answer.question.id == newQuestioner.question.id);
    if (index > -1) {
      data[index] = newQuestioner;
    } else {
      data.push(newQuestioner);
    }
    setQuestioner(data);
  }

  const handleNext = () => {
    if (!isNext) return;
    if (indexQuestion == question.length) {
      submit();
    }
    else
      setIndexQuestion(indexQuestion + 1);
  }

  const handlePrevious = () => {
    if (!isPrevious) return;
    setIndexQuestion(indexQuestion - 1);
  }

  const submit = () => {
    setIsLoading(true)
    API.post("/questioner", {
      ...customer,
      instance,
      questioner
    }).then(e => {
      setIsLoading(false)
      setIsSubmited({ success: true })
    }).catch(e => {
      setIsLoading(false)
      setIsSubmited({ success: true })
    })
  }
  const AnswerDesign = ({ data, index, isActive, onClick }: any) => {
    return (
      <div className="flex gap-2 items-center cursor-pointer "
        onClick={onClick}>
        <div
          className={`rounded-full w-5 h-5 border-primary  ${isActive ? 'border-8' : 'border-4'}`}>

        </div>
        <p className='text-center text-sm'>{data}</p  >
      </div >
    )
  }

  const Question = () => {
    return (
      <>
        <p>{question[indexQuestion].question} </p>
        <div className="grid grid-cols-1 gap-y-4 mt-8 ">
          {["Very Dissatisfied", "Dissatisfied", "Less Satisfied", "Satisfied", "Very Satisfied"].map((answerData, keyAnswer) => (
            <AnswerDesign key={keyAnswer} index={5 - keyAnswer} data={answerData} isActive={questioner.find((answer) => answer.question.id === question[indexQuestion].id)?.value == keyAnswer + 1}
              onClick={() => {
                handleQuestion({ value: keyAnswer + 1, question: question[indexQuestion] })
              }} />
          ))}

        </div>
      </>
    )

  }




  return (
    <>
      <div className='w-full min-h-screen flex justify-center items-center md:p-5 px-2 py-5'>
        <Card className="mb-8 shadow-md dark:bg-white ring-gray-300 p-0  md:w-2/5 w-full  shadow-xl">
          <CardBody className='bg-white p-10 md:px-10'>
            <p className="text-2xl text-primary font-sans font-bold">iStow Survey</p>
            <p className="text-1xl text-primary font-sans font-bold">{instance?.name}</p>

            {!isSubmited ? (
              <div className="mt-8">
                {indexQuestion == -1 ? (
                  < Form name={customer.name} position={customer.position} onNameChange={(name: string) => setCustomer({ ...customer, name })} onPositionChange={(position: string) => setCustomer({ ...customer, position })} />
                ) :
                  indexQuestion < question.length ?
                    <Question />
                    :
                    <Comments comments={customer.comments} onCommentsChanged={(comments: string) => setCustomer({ ...customer, comments })} />
                }
                <div className="flex">
                  {indexQuestion != -1 && (
                    <button onClick={handlePrevious} disabled={!isPrevious} className="disabled:bg-gray-200 disabled:hover:text-primary disabled:cursor-not-allowed  mt-6 text-sm bg-transparent hover:bg-primary text-primary hover:text-white py-2 px-4 border border-primary hover:border-transparent rounded">
                      Previous
                    </button>
                  )}
                  <button onClick={handleNext} disabled={!isNext} className="disabled:bg-gray-200 disabled:hover:text-primary disabled:cursor-not-allowed  disabled:border-transparent disabled:text-gray-400 disabled:hover:text-gray-400 self-end mt-6 ml-auto text-sm bg-transparent hover:bg-primary text-primary hover:text-white py-2 px-4 border border-primary hover:border-transparent rounded">
                    {indexQuestion == question.length ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            ) : (
              <Alert className='dark:bg-green-50 dark:text-green-900 my-5' type={isSubmited.success ? 'success' : 'danger'} >
                Thank you for filling out the questionnaire
              </Alert>
            )}
          </CardBody>
          <div className="bg-primary w-full py-2 ">
            {(indexQuestion > -1 && !isSubmited) && (<p className='text-center text-sm text-gray-200'> {questioner[indexQuestion]?.value ? indexQuestion + 1 : indexQuestion} of {question.length} answered </p>)}
          </div>
        </Card>
      </div>

      {isLoading && (<Loading />)}

    </>
  )
}

export default Home

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      ...params
    }
  }
}
