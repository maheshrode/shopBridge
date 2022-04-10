import { Component, ViewEncapsulation } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { messages } from '../app.validationmsgs';
@Component({
    providers: [],
    encapsulation: ViewEncapsulation.None,
    template: "",
})
export class ToasterComponent {
    readonly validationMsg = messages;
    constructor(private toastr: ToastrService) { }

    successMessage(Message: string) {
        this.toastr.success(Message, "", {
            timeOut: 3000,
        });
    }
    errorMessage(Message: string) {
        this.toastr.error(Message ? Message : this.validationMsg.wentWrong, "", {
            timeOut: 3000,
        });
    }
    warningMessage(Message: string) {
        this.toastr.warning(Message, "", {
            timeOut: 4000,
        });
    }
    infoMessage(Message: string) {
        this.toastr.info(Message, "", {
            timeOut: 4000,
        });
    }
}
