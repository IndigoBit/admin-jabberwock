import { DataSource } from "@angular/cdk/collections";
import { MatPaginator, MatSort } from "@angular/material";
import { map } from "rxjs/operators";
import { Observable, of as observableOf, merge, BehaviorSubject } from "rxjs";
import { User } from "../gql-schemas/user.gql-schema";

/**
 * Data source for the OrganizationDetailUserList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrganizationDetailUserListDataSource extends DataSource<User> {
  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    public data: User[],
    public filterSubject: BehaviorSubject<string>
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<User[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange,
      this.filterSubject.asObservable()
    ];

    // Set the paginator's length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(
      map(() =>
        this.getPagedData(
          this.getSortedData(this.getFilteredData([...this.data]))
        )
      )
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Very dirty filter based on how angular material does filtering.
   *
   * https://material.angular.io/components/table/overview#filtering
   * The data source will reduce each row data to a serialized form and will filter out the row if it does not contain the filter string.
   * By default, the row data reducing function will concatenate all the object values and convert them to lowercase.
   * For example, the data object {id: 123, name: 'Mr. Smith', favoriteColor: 'blue'} will be reduced to 123mr. smithblue.
   * If your filter string was blue then it would be considered a match because it is contained in the reduced string,
   *   and the row would be displayed in the table.
   * `
   * @param data
   */
  private getFilteredData(data: User[]): User[] {
    const filterValue = this.filterSubject.value.toLocaleUpperCase();
    if (!filterValue || filterValue === "") {
      return data;
    }

    return data.filter(
      user =>
        // get the props in the user object
        Object.keys(user)
          // create a string based on the value of the user prop and concatenate them into a big string
          .reduce(
            (valueString, key) =>
              valueString.concat(user[key].toLocaleUpperCase()),
            ""
          )
          // check if that string contains the filter text
          .includes(filterValue)
      // if it does this is true, that user passess the test and is returned
      // else the user fails the test is filtered out
    );
  }

  /**
   * Paginate the data (client-s_ide). If you're using server-s_ide pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: User[]): User[] {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-s_ide). If you're using server-s_ide sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: User[]): User[] {
    const field = this.sort.active;
    if (!field || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (field) {
        case "name":
        case "_id":
          return compare(a[field], b[field], isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-s_ide sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
