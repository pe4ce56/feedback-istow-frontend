import React, { useState, useEffect, useRef, FormEvent } from 'react'

import CryptoJS from "crypto-js";

import PageTitle from '../../example/components/Typography/PageTitle'
import SectionTitle from '../../example/components/Typography/SectionTitle'
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
import { EditIcon, MailIcon, PagesIcon, TrashIcon } from '../../icons'

import Layout from '../../example/containers/Layout'
import API, { checkAuth } from '../../app/API'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';


interface ITableData {
  id: number
  name: string
}


const FormModal: React.FC<{ isOpen: boolean, onClose: Function, onSubmit: Function, idEdit: number }> = ({ isOpen, onClose, onSubmit, idEdit }: any) => {



  const [name, setName] = useState("");



  useEffect(() => {
    if (idEdit == 0) return setName("");
    API.get("/instance/" + idEdit).then(e => {
      setName(e.data.name)
    }).catch(e => {
      console.log(e)
    })

  }, [idEdit])

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(name)
    onClose();
    setName('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>{idEdit == 0 ? "Add Instance" : "Edit Instance"}</ModalHeader>
      <form action="" onSubmit={submit}>
        <ModalBody>
          <Label className="mt-4">
            <Input className="mt-1" placeholder="Instance name" crossOrigin={undefined} value={name} onChange={(e) => setName(e.target.value)} />
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
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idEdit, setIdEdit] = useState(0)
  const [pageTable1, setPageTable1] = useState(1)
  const [totalResults, setTotalResults] = useState(1)
  const [dataTable1, setDataTable1] = useState<ITableData[]>([])
  const [data, setData] = useState<ITableData[]>([])
  const resultsPerPage = 10
  const [basePath, setBasePath] = useState("");

  checkAuth();

  useEffect(() => {
    getInstance()
  }, [])

  useEffect(() => {
    const host = window.location.host;
    const baseUrl = `http://${host}`;
    setBasePath(baseUrl);
  }, [router.pathname]);




  useEffect(() => {
    setPagination()
  }, [data, dataTable1])


  function onPageChangeTable1(p: number) {
    setPageTable1(p)
  }

  const setPagination = () => {
    setDataTable1(data.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage))
  }

  const getInstance = () => {
    API.get("instance").then(res => {
      setData(res.data);
      setTotalResults(res.data.length);
    }).catch(e => console.log(e))
  }

  const addInstance = (name: any) => {
    API.post("/instance", {
      name,
    }).then(e => {
      getInstance()
    }).catch(e => {
    })
  }

  const updateInstance = (name: any) => {
    API.patch("/instance/" + idEdit, {
      name,
    }).then(e => {
      getInstance()
    }).catch(e => {
    })
  }

  const removeQuestion = (id: number) => {
    API.delete("/instance/" + id).then(e => {
      getInstance()
    }).catch(e => {
    })
  }


  const handleFormSubmit = (e: any) => {
    if (idEdit == 0)
      addInstance(e)
    else
      updateInstance(e)
  }

  const copyLinkQuestioner = (data: any) => {
    const link = basePath + "/" + CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.KEY || "MERDEKA1945"
    ).toString().replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
    navigator.clipboard.writeText(link)
    toast("Copied to clipboard");
  }

  return (
    <Layout>
      <PageTitle>Instance</PageTitle>
      <div className="flex gap-2 items-center">
        <SectionTitle>Data Instance</SectionTitle>
        <Button className="mb-4" size="small" onClick={() => {
          setIdEdit(0)
          setIsModalOpen(true)
        }}>+</Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell width={200}>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable1.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm"> {data.name}</span>
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
                    <Button layout="link" size="small" onClick={() => copyLinkQuestioner(data)} >
                      <MailIcon className="w-5 h-5" aria-hidden="true" />
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
      <Toaster
        toastOptions={{
          duration: 2000,
          className: 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }}
        position='bottom-center'
      />
    </Layout >
  )
}
export default Tables
