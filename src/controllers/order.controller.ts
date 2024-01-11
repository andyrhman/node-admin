import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import sanitizeHtml from "sanitize-html";

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