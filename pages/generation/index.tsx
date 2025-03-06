import { useState } from 'react';
import { Card, Table } from 'antd';
import { useEnergy } from  '../../data/dataService';

export default function Generation() {
    const { generationData } = useEnergy();

    const columns = [
        { title: 'Energy Source', dataIndex: 'source', key: 'source' },
        { title: 'Daily Generation', dataIndex: 'daily', key: 'daily' },
        { title: 'Weekly Generation', dataIndex: 'weekly', key: 'weekly' },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Energy Generation</h1>

            <Card title="Power Generation Details" bordered>
                <Table dataSource={generationData} columns={columns} pagination={false} />
            </Card>
        </div>
    );
}
