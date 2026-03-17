import { StructureResolver } from "sanity/structure"


//Interface
interface SingletonDef {
    name : string,
    icon?: string | React.ComponentType<React.SVGProps<SVGSVGElement>> | (() => React.ReactNode)
    title: string
}

export const singletonStructure= (singletons: SingletonDef[]): StructureResolver => {
    return (S) =>
        S.list()
    .title("Content")
    .items([
      // Singleton
     ...singletons.map((singleton) => S.listItem().title(singleton.title).icon(singleton.icon).child(S.document().schemaType(singleton.name).documentId(singleton.name))),
     ...S.documentTypeListItems().filter(
        (item) =>
          !singletons.some((singleton) => singleton.name === item.getId()),
      ),
    ]);

}