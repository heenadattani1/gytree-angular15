// NGB DEPENDENCY
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/**
 * This class used for open modal with configuration
 */
export class ModalBaseClass {

  constructor(public modalService: NgbModal) { }

  /**
   * This function used for open modal with configuration
   * @param component {component}: dynamic component for render
   * @param data {object}: component data
   * @param options {NgbModalOptions}: options for pass external modal options
   * @returns NgbModalRef instance
   */
  public openPopUp(component: any, data?: { [key: string]: any }, options?: NgbModalOptions): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService
      .open(component, options || { centered: true, backdrop: 'static' });
    if (data) {
      Object.keys(data).forEach(d => modalRef.componentInstance[d] = data[d]);
    }

    return modalRef;
  }
}
