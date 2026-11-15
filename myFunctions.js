
/* تنفيذ أحداث إظهار وإخفاء تفاصيل السيارات بعد تحميل الصفحة */
$(document).ready(function () {

    // إظهار أو إخفاء تفاصيل السيارة الأولى عند الضغط على مربع الاختيار
    $("#details1").click(function () {
        $("#carDetails1").toggle();
    });

    // إظهار أو إخفاء تفاصيل السيارة الثانية
    $("#details2").click(function () {
        $("#carDetails2").toggle();
    });

    // إظهار أو إخفاء تفاصيل السيارة الثالثة
    $("#details3").click(function () {
        $("#carDetails3").toggle();
    });

    // إظهار أو إخفاء تفاصيل السيارة الرابعة
    $("#details4").click(function () {
        $("#carDetails4").toggle();
    });

    // إظهار أو إخفاء تفاصيل السيارة الخامسة
    $("#details5").click(function () {
        $("#carDetails5").toggle();
    });

});


/* التحقق من اختيار سيارة واحدة على الأقل قبل إظهار نموذج الحجز */
function continueBooking() {

    var selectedCars = document.getElementsByName("selectedCars");
    var hasSelection = false;

    // المرور على جميع السيارات للتحقق من وجود سيارة محددة
    for (var i = 0; i < selectedCars.length; i++) {

        if (selectedCars[i].checked) {
            hasSelection = true;
            break;
        }

    }

    // إظهار نموذج الحجز إذا تم اختيار سيارة
    if (hasSelection) {

        document.getElementById("bookingForm").style.display = "block";

    } else {

        // تنبيه المستخدم إذا لم يختر أي سيارة
        alert("Please select at least one car before continuing.");

    }

}


/* التحقق من بيانات الحجز وحساب التكلفة النهائية */
function submitBooking() {

    // قراءة القيم التي أدخلها المستخدم في حقول نموذج الحجز
    var customerName = document.getElementById("customerName").value;
    var nationalNumber = document.getElementById("nationalNumber").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var mobileNumber = document.getElementById("mobileNumber").value;
    var emailAddress = document.getElementById("emailAddress").value;


    // التحقق من الرقم الوطني والتأكد من أنه يتكون من 11 رقماً
    // وأن أول رقمين يمثلان رمز محافظة صحيحاً من 01 إلى 14
    if (nationalNumber == "") {
        alert("Please enter your national number.");
        return false;
    }

    var pos = nationalNumber.search(/^(0[1-9]|1[0-4])[0-9]{9}$/);

    if (pos != 0) {
        alert("National number must contain 11 digits and start with a valid governorate code (01-14).");
        return false;
    }


    // التحقق من إدخال تاريخي بداية ونهاية الاستئجار
    if (startDate == "" || endDate == "") {
        alert("Please enter both rental dates.");
        return false;
    }

    // تحويل التاريخين إلى كائنات تاريخ للمقارنة بينهما
    var start = new Date(startDate);
    var end = new Date(endDate);

    // التأكد من أن تاريخ نهاية الاستئجار يأتي بعد تاريخ البداية
    if (end <= start) {
        alert("The end date must be later than the start date.");
        return false;
    }

    // حساب عدد أيام الاستئجار بالاعتماد على الفرق بين التاريخين
    var rentalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));


    // التحقق من الاسم عند إدخاله والتأكد من استخدام الأحرف العربية فقط
    if (customerName != "") {

        pos = customerName.search(/^[\u0621-\u064A ]+$/);

        if (pos != 0) {
            alert("Please enter your name using Arabic letters only.");
            return false;
        }

    }


    // التحقق من رقم الهاتف عند إدخاله وتحديد شركة الاتصالات
    var operator = "";

    if (mobileNumber != "") {

        // التحقق من أن الرقم يتبع شبكة Syriatel
        pos = mobileNumber.search(/^(093|098|099)[0-9]{7}$/);

        if (pos == 0) {
            operator = "Syriatel";
        }
        else {

            // إذا لم يكن الرقم من Syriatel، يتم التحقق من شبكة MTN
            pos = mobileNumber.search(/^(094|095|096)[0-9]{7}$/);

            if (pos == 0) {
                operator = "MTN";
            }
            else {
                alert("Please enter a valid Syriatel or MTN number.");
                return false;
            }

        }

    }


    // التحقق من صحة البريد الإلكتروني عند إدخاله
    if (emailAddress != "") {

        pos = emailAddress.search(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);

        if (pos != 0) {
            alert("Please enter a valid email address.");
            return false;
        }

    }


    // التحقق مرة أخرى من اختيار سيارة قبل البدء بحساب التكلفة
    var selectedCars = document.getElementsByName("selectedCars");
    var hasSelectedCar = false;

    for (var i = 0; i < selectedCars.length; i++) {

        if (selectedCars[i].checked) {
            hasSelectedCar = true;
            break;
        }

    }

    if (!hasSelectedCar) {
        alert("Please select at least one car.");
        return false;
    }


    // تهيئة المتغيرات المستخدمة في حساب التكلفة وتجهيز رسالة النتيجة
    var total = 0;
    var resultMessage = "Booking Successful!\n\nSelected Cars:\n";

    // المرور على السيارات المختارة وحساب تكلفة استئجار كل سيارة
    for (var i = 0; i < selectedCars.length; i++) {

        if (selectedCars[i].checked) {

            var carName = "";
            var dailyPrice = 0;

            // تحديد اسم السيارة وسعر استئجارها اليومي حسب رمزها
            if (selectedCars[i].value == "CR-001") {
                carName = "Toyota Corolla";
                dailyPrice = 250000;
            }
            else if (selectedCars[i].value == "CR-002") {
                carName = "Kia Sportage";
                dailyPrice = 400000;
            }
            else if (selectedCars[i].value == "CR-003") {
                carName = "Hyundai Elantra";
                dailyPrice = 300000;
            }
            else if (selectedCars[i].value == "CR-004") {
                carName = "Chevrolet Spark";
                dailyPrice = 180000;
            }
            else if (selectedCars[i].value == "CR-005") {
                carName = "Chevrolet Corvette C7";
                dailyPrice = 450000;
            }

            // حساب تكلفة السيارة الواحدة وإضافتها إلى المجموع الكلي
            var carTotal = dailyPrice * rentalDays;

            total = total + carTotal;

            // إضافة بيانات السيارة وتكلفة استئجارها إلى رسالة النتيجة
            resultMessage = resultMessage +
                carName + " (" + selectedCars[i].value + ")\n" +
                "Rental Days: " + rentalDays + "\n" +
                "Cost: " + carTotal + " SYP\n\n";

        }

    }


    // تطبيق خصم بنسبة 5% إذا تجاوزت مدة الاستئجار عشرة أيام
    var discount = 0;

    if (rentalDays > 10) {
        discount = total * 0.05;
    }

    // حساب المبلغ النهائي بعد طرح الخصم
    var finalTotal = total - discount;

    // إضافة المجموع والخصم والمبلغ النهائي إلى رسالة النتيجة
    resultMessage = resultMessage +
        "Total Before Discount: " + total + " SYP\n" +
        "Discount: " + discount + " SYP\n" +
        "Final Amount: " + finalTotal + " SYP";

    // إضافة اسم شركة الاتصالات إلى النتيجة إذا أدخل المستخدم رقم هاتف
    if (mobileNumber != "") {
        resultMessage = resultMessage +
            "\nMobile Network: " + operator;
    }

    // عرض تفاصيل الحجز والتكلفة النهائية للمستخدم
    alert(resultMessage);

}


/* إخفاء نموذج الحجز عند استدعاء هذه الدالة */
function closeBooking() {

    document.getElementById("bookingForm").style.visibility = "hidden";

}
