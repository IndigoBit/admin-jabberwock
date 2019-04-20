import { NgModule } from "@angular/core";
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { from, ApolloLink } from "apollo-link";
import { HttpHeaders } from "@angular/common/http";

// TODO: this needs to come from environment
const uri = 'http://localhost:7300/';
export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({ uri });

  const authMiddleware = new ApolloLink((operation, forward) => {
    // was not able to get this to work with ngx local-storage
    const token: string = localStorage.getItem("auth-token") || "";

    if (token && token.length) {
      operation.setContext({
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`)
      });
    }

    return forward(operation);
  });

  return {
    link: from([authMiddleware, http]),
    cache: new InMemoryCache()
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
