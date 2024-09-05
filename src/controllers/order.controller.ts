import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import { Parser } from "@json2csv/plainjs";
import { myPrisma } from "../config/db.config";

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
    let search = req.query.search as string | undefined;

    let result = await myPrisma.order.findMany({ include: { orderItems: true } });

    if (search) {
        search = sanitizeHtml(search);
        const searchOrder = search.toLowerCase();

        result = result.filter(order => {
            const orderMatches = order.orderItems && order.orderItems.some(orderItem =>
                orderItem.productTitle.toLowerCase().includes(searchOrder)
            );
            return (
                order.name.toLowerCase().includes(searchOrder) ||
                order.email.toLowerCase().includes(searchOrder) ||
                orderMatches
            );
        });
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 2;
    const total = result.length;

    const data = result.slice((page - 1) * perPage, page * perPage);

    res.send({
        data,
        total,
        page,
        last_page: Math.ceil(total / perPage)
    });
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

    const orders = await myPrisma.order.findMany({ include: { orderItems: true } });

    const json = [];

    orders.forEach((o: any) => {
        o.orderItems.forEach((i: any) => {
            json.push({
                ID: o.id,
                Name: o.name,
                Email: o.email,
                'Product Title': i.productTitle,
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
    const result = await myPrisma.$queryRaw`
        SELECT
        TO_CHAR(o."created_at", 'YYYY-MM-DD') as date,
        REPLACE(TO_CHAR(TRUNC(SUM(i."price" * i."quantity")), 'FM999G999G999'), ',', '') as sum
        FROM "orders" o
        JOIN "order_items" i on o."id" = i."order_id"
        GROUP BY TO_CHAR(o."created_at", 'YYYY-MM-DD')
        ORDER BY TO_CHAR(o."created_at", 'YYYY-MM-DD') ASC;
    `;

    res.send(result);
};