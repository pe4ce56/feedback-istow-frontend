import React, { useState, useEffect, useRef, FormEvent } from 'react'

import PageTitle from '../../example/components/Typography/PageTitle'
import SectionTitle from '../../example/components/Typography/SectionTitle'
import CTA from '../../example/components/CTA'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Select,
} from '@roketid/windmill-react-ui'
import { EditIcon, TrashIcon } from '../../icons'

import Layout from '../../example/containers/Layout'
import API, { checkAuth } from '../../app/API'
import { useRouter } from 'next/router'
interface ITableData {
  id: number
  question: string
}


const FormModal: React.FC<{ isOpen: boolean, onClose: Function, onSubmit: Function, idEdit: number }> = ({ isOpen, onClose, onSubmit, idEdit }: any) => {



  const [question, setQuestion] = useState("");



  useEffect(() => {
    if (idEdit == 0) return setQuestion("");
    API.get("/question/" + idEdit).then(e => {
      setQuestion(e.data.question)
    }).catch(e => {
      console.log(e)
    })

  }, [idEdit])

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(question)
    onClose();
    setQuestion('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>{idEdit == 0 ? "Add Question" : "Edit Question"}</ModalHeader>
      <form action="" onSubmit={submit}>
        <ModalBody>
          <Label className="mt-4">
            <Input className="mt-1" placeholder="How about ?" crossOrigin={undefined} value={question} onChange={(e) => setQuestion(e.target.value)} />
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button type='submit' onClick={submit}>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" type='submit'>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal >
  )
}


function Tables() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idEdit, setIdEdit] = useState(0)
  const [pageTable1, setPageTable1] = useState(1)
  const [totalResults, setTotalResults] = useState(1)
  const [dataTable1, setDataTable1] = useState<ITableData[]>([])
  const [data, setData] = useState<ITableData[]>([])
  const resultsPerPage = 10

  checkAuth();
  useEffect(() => {
    getQuestion()
  }, [])


  useEffect(() => {
    setPagination()
  }, [data, dataTable1])


  function onPageChangeTable1(p: number) {
    setPageTable1(p)
  }

  const setPagination = () => {
    setDataTable1(data.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage))
  }

  const getQuestion = () => {
    API.get("question").then(res => {
      setData(res.data);
      setTotalResults(res.data.length);
    }).catch(e => console.log(e))
  }

  const addQuestion = (question: any) => {
    API.post("/question", {
      question,
      type: 1
    }).then(e => {
      getQuestion()
    }).catch(e => {
    })
  }

  const updateQuestion = (question: any) => {
    API.patch("/question/" + idEdit, {
      question,
      type: 1
    }).then(e => {
      getQuestion()
    }).catch(e => {
    })
  }

  const removeQuestion = (id: number) => {
    API.delete("/question/" + id).then(e => {
      getQuestion()
    }).catch(e => {
    })
  }


  const handleFormSubmit = (e: any) => {
    if (idEdit == 0)
      addQuestion(e)
    else
      updateQuestion(e)
  }
  return (
    <Layout>
      <PageTitle>Question</PageTitle>
      <div className="flex gap-2 items-center">
        <SectionTitle>Data Question</SectionTitle>
        <Button className="mb-4" size="small" onClick={() => {
          setIdEdit(0)
          setIsModalOpen(true)
        }}>+</Button>
        {/* <div className="w-24">
          <Select className="mt-1 ">
            <option>Customers</option>
            <option>Pelanggan</option>
            <option>$10,000</option>
            <option>$25,000</option>
          </Select>
        </div> */}
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Question</TableCell>
              <TableCell width={200}>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable1.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm"> {data.question}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="small" aria-label="Edit" onClick={() => {
                      setIdEdit(data.id)
                      setIsModalOpen(true)
                    }}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="small" aria-label="Delete" onClick={() => removeQuestion(data.id)}>
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable1}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
      <FormModal idEdit={idEdit} isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        setIdEdit(0);
      }} onSubmit={handleFormSubmit} />
    </Layout>
  )
}

export default Tables
