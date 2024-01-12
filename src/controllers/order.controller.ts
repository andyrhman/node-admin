import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import sanitizeHtml from "sanitize-html";
import { Parser } from "@json2csv/plainjs";
import { myDataSource } from "../index";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/order-item.entity";

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve a list of orders
 *     description: Retrieve a list of orders with optional search criteria. Returns a list of orders or a 404 status code if no matching orders are found.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering orders
 *     responses:
 *       200: 
 *          description: A list of orders.
 *       404:
 *         description: No orders found matching the search criteria.
 */
export const Orders = async (req: Request, res: Response) => {
    const repository = new OrderService();
    const take = 10;
    const page = parseInt(req.query.page as string || '1');
    let search = req.query.search;

    let result = await repository.paginate({}, page, take, ['order_item']);

    // https://www.phind.com/search?cache=za3cyqzb06bugle970v91phl
    if (typeof search === 'string') {
        search = sanitizeHtml(search);
        if (search) {
            const searchOrder = search.toString().toLowerCase();

            result.data = result.data.filter(order => {
                const orderMatches = order.order_item.some(orderItem => {
                    return orderItem.product_title.toLowerCase().includes(searchOrder);
                });
                return (
                    order.name.toLowerCase().includes(searchOrder) ||
                    order.email.toLowerCase().includes(searchOrder) ||
                    orderMatches
                );
            });

            // Check if the resulting filtered data array is empty
            if (result.data.length === 0) {
                // Respond with a 404 status code and a message
                return res.status(404).json({ message: `No ${search} matching your search criteria.` });
            }
        }
    }

    res.send(result);
};

/**
 * @swagger
 * /api/export:
 *   post:
 *     summary: Export orders to CSV
 *     description: Exports order data including items to a CSV file.
 *     tags: [Export & Chart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A CSV file of the orders.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: "ID,Name,Email,Product Title,Price,Quantity\n1,John Doe,john@example.com,Product 1,20.99,2"
 *       401:
 *         description: Unauthorized access. API key is missing or invalid.
 *       500:
 *         description: An error occurred on the server.
 */
export const Export = async (req: Request, res: Response) => {
    const parser = new Parser({
        fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity']
    });

    const repository = myDataSource.getRepository(Order);

    const orders = await repository.find({ relations: ['order_item'] })

    const json = [];

    orders.forEach((o: Order) => {
        o.order_item.forEach((i: OrderItem) => {
            json.push({
                ID: o.id,
                Name: o.name,
                Email: o.email,
                'Product Title': i.product_title,
                Price: i.price,
                Quantity: i.quantity
            });
        });
    });

    const csv = parser.parse(json);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
};

/**
 * @swagger
 * /api/chart:
 *   get:
 *     summary: Retrieve chart data
 *     description: Fetches a summary of order data, aggregated by date, and displays the total sum of orders for each date.
 *     tags: [Export & Chart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of order summary data by date.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the order.
 *                   sum:
 *                     type: string
 *                     description: The total sum of orders for the date.
 *             example:
 *               - date: "2024-01-01"
 *                 sum: "1500"
 *       401:
 *         description: Unauthorized access. API key is missing or invalid.
 *       500:
 *         description: An error occurred on the server.
 */
export const Chart = async (req: Request, res: Response) => {

    const data = myDataSource;

    const result = await data.query(`
        SELECT
        TO_CHAR(o.created_at, 'YYYY-MM-DD') as date,
        REPLACE(TO_CHAR(TRUNC(sum(i.price * i.quantity)), 'FM999G999G999'), ',', '') as sum
        FROM orders o
        JOIN order_items i on o.id = i.order_id
        GROUP BY TO_CHAR(o.created_at, 'YYYY-MM-DD')
        ORDER BY TO_CHAR(o.created_at, 'YYYY-MM-DD') ASC;    
    `)

    res.send(result);
};