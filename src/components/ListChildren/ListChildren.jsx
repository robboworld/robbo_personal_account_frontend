import React from 'react'
import { List } from 'antd'
import { useQuery } from '@apollo/client'

import ChildrenContent from './ChildrenContent'

import Flex from '@/components/Flex'
import ListItem from '@/components/ListItem'
import Loader from '@/components/Loader'
import { DragResize } from '@/components/UI'
import { studentQuerysGQL } from '@/graphQL'


const ListChildren = ({ profile, isUserAParent }) => {

    const { loading, error, data } = useQuery(studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID, {
        variables: { parentId: profile.id },
        notifyOnNetworkStatusChange: true,
    })

    if (isUserAParent) {
        return (
            <React.Fragment>
                {
                    loading
                        ? <Loader />
                        : (
                            <Flex direction='column' width='100%'>
                                <h3>Дети</h3>
                                <List
                                    dataSource={data.GetStudentsByParentId.students}
                                    renderItem={({ userHttp }, index) => (
                                        <ListItem
                                            itemIndex={index}
                                            key={index}
                                            render={(open, setOpen) => (
                                                <DragResize
                                                    open={open} setOpen={setOpen}
                                                    content={() => (
                                                        <ChildrenContent childrenId={userHttp.id} />
                                                    )}
                                                />
                                            )}
                                            label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                        />
                                    )}
                                />
                            </Flex>
                        )
                }
            </React.Fragment>
        )
    }
}

export default ListChildren