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

interface ITableInstance {
  name: string
}

interface ITableData {
  id: number
  name: string,
  position: string,
  comments: string,
  instance: ITableInstance
}

function Tables() {
  const [pageTable1, setPageTable1] = useState(1)
  const [totalResults, setTotalResults] = useState(1)
  const [dataTable1, setDataTable1] = useState<ITableData[]>([])
  const [data, setData] = useState<ITableData[]>([])
  const resultsPerPage = 10

  checkAuth();

  useEffect(() => {
    getQuestioners()
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

  const getQuestioners = () => {
    API.get("questioner").then(res => {
      setData(res.data);
      setTotalResults(res.data.length);
    }).catch(e => console.log(e))
  }


  return (
    <Layout>
      <PageTitle>Instance</PageTitle>
      <div className="flex gap-2 items-center">
        <SectionTitle>Data Questioners</SectionTitle>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell width={250}>Name</TableCell>
              <TableCell width={200}>Position</TableCell>
              <TableCell width={250}>Instance</TableCell>
              <TableCell width={300}>Comments</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable1.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm"> {data.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {data.position}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {data.instance.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {data.comments}</span>
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
    </Layout >
  )
}
export default Tables
