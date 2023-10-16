import React, { useState, useEffect } from 'react'

import InfoCard from '../../example/components/Cards/InfoCard'
import PageTitle from '../../example/components/Typography/PageTitle'
import RoundIcon from '../../example/components/RoundIcon'
import Layout from '../../example/containers/Layout'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from '../../icons'

import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Card,
  CardBody,
  Input,
} from '@roketid/windmill-react-ui'

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import API, { useAuth } from '../../app/API'
import SectionTitle from '../../example/components/Typography/SectionTitle'
import round from '../../utils'
import { start } from 'repl'
import { useRouter } from 'next/router'

interface IQuestion {
  id: number,
  question: string,
  created_at: string,
  updated_at: string,
  questioners: IQuestioner[]
}

interface IQuestioner {
  id: number,
  value: number,
  index: number
}


function Dashboard() {
  Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  useAuth();

  const [startDate, setStartDate] = useState<string>(() => {
    let date_today = new Date();

    return new Date(date_today.getFullYear(), date_today.getMonth(), 2).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    let date_today = new Date();

    return new Date(date_today.getFullYear(), date_today.getMonth() + 1, 0).toISOString().split('T')[0];
  });

  // grading
  const [grading, setGrading] = useState(96);

  const [page, setPage] = useState(1)
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [dataTable, setDataTable] = useState<IQuestion[]>([])
  const [totalRespondent, setTotalRespondent] = useState<number>(0)
  const resultsPerPage = 10;

  function onPageChange(p: number) {
    setPage(p)
  }


  useEffect(() => {
    getQuestioner()
  }, [endDate, startDate])


  useEffect(() => {
    setDataTable(questions.slice((page - 1) * resultsPerPage, page * resultsPerPage))
    calculateAverage();
  }, [questions])

  useEffect(() => {
    setDataTable(questions.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  const getQuestioner = () => {
    API.get(`questioner/respondents?start=${startDate}&end=${endDate}`).then(res => {
      let total = 0;
      let customer: any = [];
      for (let o of res.data) {
        for (let questioner of o.questioners) {
          if (customer.findIndex((e: any) => e == questioner.customer.id) > -1) continue;
          customer.push(questioner.customer.id)
          total++;
        }
      }
      setTotalRespondent(total);
      setQuestions(res.data);
    }).catch(e => console.log(e))
  }

  const calculateAverage = () => {

    let total = 0;
    for (let o of questions) {
      total += calculateIndex(o.questioners);
    }
    setGrading(total / questions.length)
  }
  const getFrequencyCount = (questioners: IQuestioner[], value: number) => {
    return questioners.filter(quesioners => quesioners.value == value).length
  }


  const calculateIndex = (questioners: IQuestioner[]): number => {
    const value1 = getFrequencyCount(questioners, 1) / totalRespondent;
    const value2 = getFrequencyCount(questioners, 2) / totalRespondent;
    const value3 = getFrequencyCount(questioners, 3) / totalRespondent;
    const value4 = getFrequencyCount(questioners, 4) / totalRespondent;
    const value5 = getFrequencyCount(questioners, 5) / totalRespondent;
    return ((value1 * 1) + (value2 * 2) + (value3 * 3) + (value4 * 4) + (value5 * 5)) / 5 * 100
  }

  return (
    <Layout>
      <PageTitle>Dashboard</PageTitle>
      <div className="grid md:grid-cols-2 gap-2">
        <Card className='mb-5'>
          <CardBody className='flex gap-2'>
            {/* Start Date */}
            <Input type='date' crossOrigin={undefined} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </CardBody>
        </Card>
        <Card className='mb-5'>
          <CardBody className='flex gap-2'>
            {/* End Date */}
            <Input type='date' crossOrigin={undefined} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </CardBody>
        </Card>
      </div>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="total Respondents" value={"" + totalRespondent}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>
      </div>


      <SectionTitle>Satisfaction Level</SectionTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <div className="col-span-3">
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell rowSpan={2} className='text-center'>Question</TableCell>
                  <TableCell colSpan={5} className="text-center">Frequency</TableCell>
                  <TableCell rowSpan={2} className='w-24 text-center'>Total</TableCell>
                  <TableCell rowSpan={2} className='w-24 text-center'>Index</TableCell>
                </tr>
                <tr>
                  <TableCell className='w-20 text-center'>1</TableCell>
                  <TableCell className='w-20 text-center' >2</TableCell>
                  <TableCell className='w-20 text-center' >3</TableCell>
                  <TableCell className='w-20 text-center' >4</TableCell>
                  <TableCell className='w-20 text-center'>5</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {dataTable.map((question: IQuestion, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-semibold">{question.question}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-center">{round(getFrequencyCount(question.questioners, 1))} </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-center">{round(getFrequencyCount(question.questioners, 2))}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-center">{round(getFrequencyCount(question.questioners, 3))}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-center">{round(getFrequencyCount(question.questioners, 4))}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-center">{round(getFrequencyCount(question.questioners, 5))}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-center">{question.questioners.length}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm  text-center">{round(calculateIndex(question.questioners))}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={questions.length}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
        </div>
        <div className="col-span-1">
          <Card className="mb-8 shadow-md">
            <CardBody>
              <p className="text-md text-gray-600 dark:text-gray-400 text-center w-full">
                Average Total Score
              </p>
              <p className='text-3xl mt-4 text-gray-600 dark:text-gray-400 text-center font-bold '>{round(grading)}</p>
              <TableContainer className="mt-4">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell colSpan={2} className="text-center text-md">Grading</TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody className='text-sm'>
                    <TableRow className={grading < 60 ? "bg-red-600 dark:text-gray-800" : ""} >
                      <TableCell>
                        <p>{"< 60"}</p>
                      </TableCell>
                      <TableCell>
                        <p>BAD</p>
                      </TableCell>

                    </TableRow>
                    <TableRow className={grading >= 60 && grading <= 75 ? "bg-red-400 dark:text-gray-800" : ""}  >
                      <TableCell>
                        <p>{"60.0 - 75.0"}</p>
                      </TableCell>
                      <TableCell>
                        <p>Fair</p>
                      </TableCell>
                    </TableRow>
                    <TableRow className={grading >= 76 && grading <= 85 ? "bg-yellow-400 dark:text-gray-800" : ""}  >
                      <TableCell>
                        <p>{"76.0 - 85.0"}</p>
                      </TableCell>
                      <TableCell>
                        <p>Good</p>
                      </TableCell>
                    </TableRow>
                    <TableRow className={grading >= 86 && grading <= 95 ? "bg-green-300 dark:text-gray-800" : ""}  >
                      <TableCell>
                        <p>{"86.0 - 95.0"}</p>
                      </TableCell>
                      <TableCell>
                        <p>VERRY GOOD</p>
                      </TableCell>
                    </TableRow>
                    <TableRow className={grading > 95 ? "bg-green-400 dark:text-gray-800" : ""}  >
                      <TableCell>
                        <p>{"> 95.0"}</p>
                      </TableCell>
                      <TableCell>
                        <p>EXCELENT</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardBody>

          </Card>
        </div>


      </div>
      {/* <PageTitle>Charts</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
      </div> */}

    </Layout>
  )
}


export default Dashboard
