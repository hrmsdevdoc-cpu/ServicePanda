-- Check all potential customers
SELECT * FROM public.potential_customers ORDER BY id ASC;

-- Check Queensland customers specifically
SELECT id, name, state, city, region, email, phone 
FROM public.potential_customers 
WHERE state = 'QLD' 
ORDER BY id ASC;

-- Check Brisbane - East customers specifically
SELECT id, name, state, city, region, email, phone 
FROM public.potential_customers 
WHERE region = 'Brisbane - East' 
ORDER BY id ASC;

-- Check all unique regions
SELECT DISTINCT region 
FROM public.potential_customers 
WHERE region IS NOT NULL 
ORDER BY region;

-- Check regions containing "Brisbane"
SELECT DISTINCT region 
FROM public.potential_customers 
WHERE region ILIKE '%brisbane%' 
ORDER BY region;

-- Count customers by region
SELECT region, COUNT(*) as customer_count 
FROM public.potential_customers 
WHERE region IS NOT NULL 
GROUP BY region 
ORDER BY customer_count DESC;
