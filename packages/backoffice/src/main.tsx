import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routing } from './routes';
import 'antd/dist/antd.css';
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <Routing />
    </QueryClientProvider>
)
