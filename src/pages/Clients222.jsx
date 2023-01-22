// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useSearchParams } from 'react-router-dom'
// import { Modal, Button, Row, Col, List, Typography } from 'antd'

// import PageLayout from '@/components/PageLayout'
// import ListItem from '@/components/ListItem'
// import ParentContent from '@/components/ParentContent'
// import AddParent from '@/components/AddParent/AddParent'
// import { DragResize } from '@/components/UI'
// import { useActions } from '@/helpers/useActions'
// import { getClientsState } from '@/reducers/clients'
// import {
//     getClientsRequest,
//     deleteParentRequest,
//     clearClientsState,
// } from '@/actions'

// const { Title } = Typography

// export default () => {
//     const actions = useActions({ getClientsRequest, deleteParentRequest, clearClientsState }, [])
//     const [searchParams, setSearchParams] = useSearchParams()
//     const currentPage = searchParams.get('page') || '1'
//     useEffect(() => {
//         actions.getClientsRequest(currentPage, '10')
//         return () => actions.clearClientsState()
//     }, [currentPage])

//     const { parents, countRows, clientsLoading } = useSelector(({ clients }) => getClientsState(clients))
//     const [openAddClients, setOpenAddClients] = useState(false)

//     return (
//         <PageLayout>
//             <Row align='middle'>
//                 <Col span={22}>
//                     <Title>Клиенты</Title>
//                 </Col>
//                 <Col span={1}>
//                     <Button type='primary' onClick={() => setOpenAddClients(true)}>
//                         Добавить родителя
//                     </Button>
//                 </Col>
//             </Row>
//             <Modal
//                 title='Заполните данные клиента'
//                 centered
//                 open={openAddClients}
//                 onCancel={() => setOpenAddClients(false)}
//                 footer={[]}
//             >
//                 <AddParent />
//             </Modal>
//             <Row>
//                 <Col span={24}>
//                     <List
//                         loading={clientsLoading}
//                         bordered
//                         size='large'
//                         dataSource={parents}
//                         pagination={{
//                             onChange: page => {
//                                 setSearchParams({ page })
//                             },
//                             total: countRows,
//                             current: +currentPage,
//                             defaultCurrent: 1,
//                             defaultPageSize: 10,
//                             responsive: true,
//                         }}
//                         itemLayout='vertical'
//                         renderItem={({ userHttp }, index) => (
//                             <ListItem
//                                 itemIndex={index}
//                                 handleDelete={
//                                     parentIndex => actions.deleteParentRequest(userHttp.id, parentIndex)
//                                 }
//                                 label={`
//                                                         ${userHttp.lastname}
//                                                         ${userHttp.firstname}
//                                                         ${userHttp.middlename}
//                                                 `}
//                                 key={index}
//                                 render={(open, setOpen) => (
//                                     <DragResize
//                                         open={open} setOpen={setOpen}
//                                         content={() => (
//                                             <ParentContent clientId={userHttp.id} />
//                                         )}
//                                     />
//                                 )}
//                             />
//                         )}
//                     />
//                 </Col>
//             </Row>
//         </PageLayout >
//     )
// }
