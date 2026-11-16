/**
 * Full-pane error page.
 * Replaces the reading view when a document cannot be loaded, so stale
 * header/TOC/body from the previous document never stay on screen.
 *
 * Action handlers are injected by main.js (composition root).
 */

import { DOM } from '../core/dom.js';

const COPY = {
  'not-found': {
    code: '404',
    title: 'Không tìm thấy tài liệu',
    message: 'Đường dẫn này có thể đã bị đổi tên, di chuyển hoặc chưa được tạo. Hãy chọn tài liệu khác ở mục lục bên trái.'
  },
  server: {
    code: 'LỖI MÁY CHỦ',
    title: 'Máy chủ không thể trả về tài liệu',
    message: 'Yêu cầu đã tới máy chủ nhưng bị từ chối. Thử lại sau ít phút hoặc chọn tài liệu khác.'
  },
  network: {
    code: 'MẤT KẾT NỐI',
    title: 'Không kết nối được tới máy chủ',
    message: 'Kiểm tra kết nối mạng hoặc tiến trình dev server, sau đó bấm "Thử lại".'
  },
  unknown: {
    code: 'LỖI',
    title: 'Không thể tải tài liệu',
    message: 'Đã xảy ra lỗi không xác định trong khi nạp nội dung.'
  }
};

let actions = { onHome: () => {}, onRetry: () => {} };

export function initErrorView({ onHome, onRetry }) {
  actions = { onHome: onHome || actions.onHome, onRetry: onRetry || actions.onRetry };

  DOM.errorHomeBtn.addEventListener('click', () => actions.onHome());
  DOM.errorRetryBtn.addEventListener('click', () => actions.onRetry());
}

/**
 * @param {{kind?: string, message?: string, status?: number, docPath?: string}} error
 * @param {string} [docPath]
 */
export function showError(error, docPath = '') {
  const kind = (error && error.kind) || 'unknown';
  const copy = COPY[kind] || COPY.unknown;
  const requestedPath = docPath || (error && error.docPath) || '';

  DOM.errorCode.textContent = (kind === 'server' && error && error.status)
    ? `HTTP ${error.status}`
    : copy.code;
  DOM.errorTitle.textContent = copy.title;
  DOM.errorMessage.textContent = copy.message;
  DOM.errorPath.textContent = requestedPath;

  DOM.loadingState.style.display = 'none';
  DOM.docHeader.style.display = 'none';
  DOM.markdownContainer.style.display = 'none';
  DOM.markdownContainer.innerHTML = '';
  DOM.tocNav.innerHTML = '<p class="toc-empty">Không có mục lục</p>';
  DOM.errorState.style.display = 'flex';
}

export function hideError() {
  DOM.errorState.style.display = 'none';
  DOM.docHeader.style.display = '';
  DOM.markdownContainer.style.display = '';
}
