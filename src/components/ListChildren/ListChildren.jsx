import React, { useState } from 'react'
import { List } from 'antd'

import ChildrenContent from './ChildrenContent'

import Flex from '@/components/Flex'
import ListItem from '@/components/ListItem'
import Loader from '@/components/Loader'
import { DragResize } from '@/components/UI'

import { usersQueryGraphQL } from '@/graphQL'

const ListChildren = ({ profile, isUserAParent }) => {

    const [childrenState, setChildrenState] = useState({
        loading: true,
        data: null,
        error: null,
    })

    usersQueryGraphQL.getStudentsByParentId({ parentId: profile.id })
        .then(result => setChildrenState({ loading: result.loading, data: result.data }))

    if (isUserAParent) {
        return (
            <React.Fragment>
                {
                    childrenState.loading
                        ? <Loader />
                        : (
                            <Flex direction='column' width='100%'>
                                <h3>Дети</h3>
                                <List
                                    dataSource={childrenState.data.GetStudentsByParentId}
                                    renderItem={({ userHttp }, index) => (
                                        <ListItem
                                            itemIndex={index}
                                            key={index}
                                            render={(open, setOpen) => (
                                                <DragResize
                                                    open={open} setOpen={setOpen}
                                                    content={() => (
                                                        <ChildrenContent childrenId={userHttp.id} open={open}
                                                            setOpen={setOpen} />
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