import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentMonthYear, getMonthDateRange } from "../utils/constants";
import { getAmountSummary } from '../services/amountService';
import {
    getWorkItems,
    createWorkItem,
    updateWorkItem,
    deleteWorkItem
} from '../services/workService';
import { getAccessories, createAccessory, updateAccessory, deleteAccessory } from '../services/accessoryService';
import { useAuth } from "../auth/AuthContext";

const AppContext = createContext();

export function AppProvider({ children }) {
    const { user } = useAuth();

    const LIMIT = 10;

    const current = getCurrentMonthYear();

    const range = getMonthDateRange(
        current.month,
        current.year
    );

    // Customers page

    const [filters, setFilters] = useState({
        name: "",
        status: "",
        workType: "",
        priority: "",
        month: current.month,
        year: current.year,
        startDate: range.startDate,
        endDate: range.endDate

    });
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [workItems, setWorkItems] = useState([]);

    // Accessory Page

    const [accessoryFilters, setAccessoryFilters] = useState({
        workType: "",
        name: "",
        month: current.month,
        year: current.year,
        startDate: range.startDate,
        endDate: range.endDate
    });

    const [accessories, setAccessories] = useState([]);

    const [accessoryPage, setAccessoryPage] = useState(1);

    const [accessoryTotalRows, setAccessoryTotalRows] = useState(0);

    // Amount
    const [amountFilters, setAmountFilters] = useState({
        name: "",
        month: current.month,
        year: current.year,
        startDate: range.startDate,
        endDate: range.endDate
    });

    const [amountPage, setAmountPage] = useState(1);

    const [amountRows, setAmountRows] = useState([]);

    const [amountTotalRows, setAmountTotalRows] = useState(0);
    // Load Data
    useEffect(() => {
        if (!user) {
            setWorkItems([]);
            return;
        }

        loadWorkItems();
    }, [user?.id, filters, page]);

    useEffect(() => {
        if (!user) {
            setAccessories([]);
            return;
        }

        loadAccessories();
    }, [user?.id, accessoryFilters, accessoryPage]);

    useEffect(() => {
        if (!user) {
            setAmountRows([]);
            return;
        }

        loadAmount();
    }, [user?.id, amountFilters, amountPage]);
    // Customers
    async function loadWorkItems() {
        try {
            const result = await getWorkItems(filters, page, LIMIT);

            setTotalRows(result.count);

            const formatted = result.data.map(item => ({
                id: item.id,
                name: item.name,
                phone: item.phone,
                city: item.city,
                status: item.status,
                workType: item.work_type,
                comments: item.comments,
                date: item.work_date,
                priority: item.priority,
                dueDate: item.due_date,
                reminder: item.reminder,
                serviceAmount: item.service_amount,
                servicePaid: item.service_paid,
                serviceBalance: item.service_balance,

                accessoriesAmount: item.accessories_amount,
                accessoriesPaid: item.accessories_paid,
                accessoriesBalance: item.accessories_balance,

                accessories: item.accessories || []
            }));

            setWorkItems(formatted);

        } catch (err) {
            console.error(err);
        }
    }

    async function handleSaveWorkItem(item) {
        try {
            if (item.id) {
                await updateWorkItem(item.id, item);
            } else {
                await createWorkItem(item);
            }

            await loadWorkItems();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteWorkItem(id) {
        try {
            await deleteWorkItem(id);

            await loadWorkItems();
        } catch (err) {
            console.error(err);
        }
    }

    // Accessory
    async function loadAccessories() {

        const result = await getAccessories(
            accessoryFilters,
            accessoryPage,
            10
        );

        setAccessoryTotalRows(result.count);

        setAccessories(
            result.data.map(a => ({
                id: a.id,
                workType: a.work_type,
                buyDate: a.buy_date,
                productName: a.product_name,
                amount: a.amount
            }))
        );
    }

    async function handleSaveAccessory(item) {

        if (item.id)
            await updateAccessory(item.id, item);
        else
            await createAccessory(item);

        loadAccessories();
    }

    async function handleDeleteAccessory(id) {

        await deleteAccessory(id);

        loadAccessories();

    }

    //   Amount
    async function loadAmount() {

        const result = await getAmountSummary(
            amountFilters,
            amountPage,
            10
        );

        setAmountTotalRows(result.count);

        setAmountRows(
            result.data.map(item => ({
                id: item.id,
                name: item.name,

                serviceAmount: Number(item.service_amount),
                servicePaid: Number(item.service_paid),
                serviceBalance: Number(item.service_balance),

                latestDate: item.work_date
            }))
        );

    }


    return (
        <AppContext.Provider
            value={{
                // Customers
                workItems,
                filters,
                setFilters,
                page,
                setPage,
                totalRows,
                handleSaveWorkItem,
                handleDeleteWorkItem,

                // Accessories
                accessories,
                accessoryFilters,
                setAccessoryFilters,
                accessoryPage,
                setAccessoryPage,
                accessoryTotalRows,
                handleSaveAccessory,
                handleDeleteAccessory,

                // Amount
                amountRows,
                amountFilters,
                setAmountFilters,
                amountPage,
                setAmountPage,
                amountTotalRows,
            }}
        >
            {children}
        </AppContext.Provider>
    );

}

export function useApp() {
    return useContext(AppContext);
}