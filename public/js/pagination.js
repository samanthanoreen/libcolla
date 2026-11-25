/**
 * Shared table pagination helper for LibColla.
 * Two usage patterns:
 *   1) paginateStaticRows(tbody, container, opts) — for tables whose rows
 *      are already rendered server-side (PHP foreach); just shows/hides <tr>s.
 *   2) renderPaginationControls(container, opts) — low-level control renderer
 *      for pages that rebuild their <tbody> from a JS data array
 *      (program.php, manage_reports.php).
 */

function renderPaginationControls(container, opts) {
    if (!container) return;
    const {
        total,
        page,
        pageSize,
        sizes = [5, 15, 30],
        onPageChange,
        onPageSizeChange
    } = opts;

    if (!total) { container.innerHTML = ''; return; }

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, total);

    container.innerHTML = `
        <div class="table-pagination">
            <div class="pagination-info">Showing ${start}&ndash;${end} of ${total}</div>
            <div class="pagination-controls">
                <label class="pagination-size-label">
                    Show
                    <select class="pagination-size-select">
                        ${sizes.map(s => `<option value="${s}" ${s === pageSize ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                    per page
                </label>
                <button type="button" class="pagination-btn" data-dir="prev" ${safePage <= 1 ? 'disabled' : ''} aria-label="Previous page">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span class="pagination-page">Page ${safePage} of ${totalPages}</span>
                <button type="button" class="pagination-btn" data-dir="next" ${safePage >= totalPages ? 'disabled' : ''} aria-label="Next page">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;

    const sizeSelect = container.querySelector('.pagination-size-select');
    if (sizeSelect && onPageSizeChange) {
        sizeSelect.addEventListener('change', (e) => onPageSizeChange(parseInt(e.target.value, 10)));
    }
    const prevBtn = container.querySelector('[data-dir="prev"]');
    const nextBtn = container.querySelector('[data-dir="next"]');
    if (prevBtn && onPageChange) prevBtn.addEventListener('click', () => onPageChange(safePage - 1));
    if (nextBtn && onPageChange) nextBtn.addEventListener('click', () => onPageChange(safePage + 1));
}

function paginateStaticRows(tbody, container, opts = {}) {
    if (!tbody) return;
    const rows = Array.from(tbody.children).filter(r => r.dataset.paginationSkip !== 'true');
    let pageSize = opts.pageSize || 15;
    let page = 1;

    function render() {
        const total = rows.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (page > totalPages) page = totalPages;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        rows.forEach((row, i) => {
            row.style.display = (i >= start && i < end) ? '' : 'none';
        });

        renderPaginationControls(container, {
            total,
            page,
            pageSize,
            onPageChange: (p) => { page = p; render(); },
            onPageSizeChange: (size) => { pageSize = size; page = 1; render(); }
        });
    }

    render();
    return { refresh: render };
}
