export const paginate = (req) => {

    const page =
        parseInt(req.query.page) || 1;

    const limit =
        parseInt(req.query.limit) || 20;

    const skip =
        (page - 1) * limit;

    return { page, limit, skip };

};

export const getPaginationData = (total_items, page, limit) => {
    return {
        page,
        limit,
        total_items,
        total_pages: Math.ceil(total_items / limit)
    };
};
