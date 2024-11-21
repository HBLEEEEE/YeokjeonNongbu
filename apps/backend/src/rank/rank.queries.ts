export const rankQueries = {
  moneyDataQuery: `SELECT
        m.nickname,
        m.total_cash + COALESCE(SUM(mc.quantity * cp.price), 0) AS total_asset
    FROM 
        members m
    LEFT JOIN 
        member_crops mc ON m.member_id = mc.member_id
    LEFT JOIN 
        crop_prices cp ON mc.crop_id = cp.crop_id
        AND cp.time = (SELECT MAX(time) FROM crop_prices WHERE crop_id = mc.crop_id)
    GROUP BY 
        m.member_id, m.total_cash
    ORDER BY 
        total_asset DESC;`
};
