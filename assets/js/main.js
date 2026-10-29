/* ===================================================
   ملف التفاعلية JavaScript - دليل فعاليات الجامعة الافتراضية
   مقرر BWP401
   =================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ---------------------------------------------------
    // 1. تفعيل الوضع الليلي البسيط وحفظه في localStorage (Bonus)
    // ---------------------------------------------------
    const darkModeBtn = document.getElementById("darkModeToggle");
    if (localStorage.getItem("svu_dark_mode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("svu_dark_mode", "enabled");
            } else {
                localStorage.setItem("svu_dark_mode", "disabled");
            }
        });
    }

    // ---------------------------------------------------
    // 2. زر الصعود إلى أعلى الصفحة (Scroll-to-top Button)
    // ---------------------------------------------------
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 250) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        });

        scrollTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ---------------------------------------------------
    // 3. فلترة سريعة في الصفحة الرئيسية + حفظ التفضيل في localStorage
    // ---------------------------------------------------
    const quickCategoryButtons = document.querySelectorAll(".category-quick-btn");
    const homeEventItems = document.querySelectorAll(".home-event-item");

    function filterHomeEvents(selectedCategory) {
        homeEventItems.forEach(function (item) {
            const itemCat = item.getAttribute("data-category");
            if (selectedCategory === "all" || itemCat === selectedCategory) {
                item.classList.remove("d-none");
            } else {
                item.classList.add("d-none");
            }
        });
    }

    if (quickCategoryButtons.length > 0) {
        // استرجاع التصنيف المفضل من localStorage إن وجد
        const savedCategory = localStorage.getItem("svu_preferred_category");
        if (savedCategory) {
            quickCategoryButtons.forEach(function (btn) {
                btn.classList.toggle("active", btn.getAttribute("data-category") === savedCategory);
            });
            filterHomeEvents(savedCategory);
        }

        quickCategoryButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                quickCategoryButtons.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");

                const chosenCategory = btn.getAttribute("data-category");
                localStorage.setItem("svu_preferred_category", chosenCategory);
                filterHomeEvents(chosenCategory);
            });
        });
    }

    // ---------------------------------------------------
    // 4. فلترة وبحث الفعاليات في صفحة events.html
    // ---------------------------------------------------
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const locationFilter = document.getElementById("locationFilter");
    const dateFilter = document.getElementById("dateFilter");
    const resetFilterBtn = document.getElementById("resetFilterBtn");
    const eventItems = document.querySelectorAll(".event-item");
    const noResultsAlert = document.getElementById("noResultsAlert");

    function applyEventsFilter() {
        if (eventItems.length === 0) return;

        const searchValue = searchInput.value.trim().toLowerCase();
        const categoryValue = categoryFilter.value;
        const locationValue = locationFilter.value;
        const dateValue = dateFilter.value;

        let visibleCount = 0;

        eventItems.forEach(function (card) {
            const title = card.getAttribute("data-title").toLowerCase();
            const category = card.getAttribute("data-category");
            const location = card.getAttribute("data-location");
            const date = card.getAttribute("data-date");

            const matchSearch = title.includes(searchValue);
            const matchCategory = (categoryValue === "all" || category === categoryValue);
            const matchLocation = (locationValue === "all" || location === locationValue);
            const matchDate = (dateValue === "" || date === dateValue);

            if (matchSearch && matchCategory && matchLocation && matchDate) {
                card.classList.remove("d-none");
                visibleCount++;
            } else {
                card.classList.add("d-none");
            }
        });

        // إظهار تنبيه في حال عدم وجود نتائج مطابقة
        if (visibleCount === 0) {
            noResultsAlert.classList.remove("d-none");
        } else {
            noResultsAlert.classList.add("d-none");
        }
    }

    if (searchInput && categoryFilter && locationFilter && dateFilter) {
        searchInput.addEventListener("input", applyEventsFilter);
        categoryFilter.addEventListener("change", applyEventsFilter);
        locationFilter.addEventListener("change", applyEventsFilter);
        dateFilter.addEventListener("change", applyEventsFilter);

        resetFilterBtn.addEventListener("click", function () {
            searchInput.value = "";
            categoryFilter.value = "all";
            locationFilter.value = "all";
            dateFilter.value = "";
            applyEventsFilter();
        });
    }

    // ---------------------------------------------------
    // 5. أزرار التفاعل في صفحة تفاصيل الفعالية event.html
    // ---------------------------------------------------
    const addToCalendarBtn = document.getElementById("addToCalendarBtn");
    const shareEventBtn = document.getElementById("shareEventBtn");
    const eventActionAlert = document.getElementById("eventActionAlert");
    const bookingForm = document.getElementById("bookingForm");

    function showEventMessage(messageText) {
        if (!eventActionAlert) return;
        eventActionAlert.textContent = messageText;
        eventActionAlert.classList.remove("d-none");
    }

    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener("click", function () {
            showEventMessage("تمت إضافة موعد الندوة (2026-11-05) إلى تذكيرات تقويمك بنجاح.");
        });
    }

    if (shareEventBtn) {
        shareEventBtn.addEventListener("click", function () {
            showEventMessage("تم نسخ رابط الفعالية لمشاركته مع زملائك في الجامعة.");
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const studentName = document.getElementById("bookName").value.trim();
            showEventMessage("تم تسجيل حجز مبدئي للطالب: " + studentName + " بنجاح.");
            bookingForm.reset();
            const modalEl = document.getElementById("bookingModal");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
        });
    }

    // ---------------------------------------------------
    // 6. التحقق من نموذج اتصل بنا وعرض Bootstrap Alerts
    // ---------------------------------------------------
    const contactForm = document.getElementById("contactForm");
    const formAlertContainer = document.getElementById("formAlertContainer");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            // صيغة بسيطة للتحقق من البريد الإلكتروني
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // التحقق من الحقول الفارغة
            if (name === "" || email === "" || message === "") {
                formAlertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>خطأ في الإرسال:</strong> يرجى تعبئة جميع الحقول المطلوبة (الاسم، البريد، والرسالة).
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                return;
            }

            // التحقق من صحة البريد الإلكتروني
            if (!emailPattern.test(email)) {
                formAlertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>صيغة بريد غير صحيحة:</strong> يرجى إدخال بريد إلكتروني صحيح مثل (student@svuonline.org).
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                return;
            }

            // في حال نجاح التحقق
            formAlertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>تم الإرسال بنجاح!</strong> شكراً لك يا ${name}، تم استلام رسالتك وسيتم الرد عليك قريباً.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            contactForm.reset();
        });
    }
});