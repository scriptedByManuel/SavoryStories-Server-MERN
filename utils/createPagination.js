const createPagination = (page, limit, total, skip, lastPage, sort, search, items, req) => {

  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const queryBase = `limit=${limit}&sort=${sort}&search=${search}`;

  const links = {
    first: `${baseUrl}?${queryBase}&page=1`,
    last: `${baseUrl}?${queryBase}&page=${lastPage}`,
    prev: page > 1 ? `${baseUrl}?${queryBase}&page=${page - 1}` : null,
    next: page < lastPage ? `${baseUrl}?${queryBase}&page=${page + 1}` : null,
  };

  const metaLinks = [];

  // Previous
  metaLinks.push({
    url: page > 1 ? `${baseUrl}?${queryBase}&page=${page - 1}` : null,
    label: "&laquo; Previous",
    active: false,
  });

  // Page numbers
  for (let i = 1; i <= lastPage; i++) {
    metaLinks.push({
      url: `${baseUrl}?${queryBase}&page=${i}`,
      label: `${i}`,
      active: i === page,
    });
  }

  // Next
  metaLinks.push({
    url: page < lastPage ? `${baseUrl}?${queryBase}&page=${page + 1}` : null,
    label: "Next &raquo;",
    active: false,
  });

  const meta = {
    current_page: page,
    from: total === 0 ? 0 : skip + 1,
    to: skip + items.length,
    last_page: lastPage,
    per_page: limit,
    total,
    links: metaLinks,
  };
  return { skip, links, meta };
};

module.exports = createPagination;
