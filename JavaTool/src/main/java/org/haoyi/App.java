package org.haoyi;

import org.haoyi.entity.Link;
import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Read data from XML to POJO
 *
 */
public class App 
{
    public static void main( String[] args ) throws IOException, SAXException, ParserConfigurationException {
        List<Link> links = parseLinksXML();

        for(int i = 0; i < links.size(); i++){
            Link link = links.get(i);
            System.out.println("");
            System.out.println("link id: " + link.getId());
            System.out.println("link upstream: " + link.getUpStream());
            System.out.println("link downstream: " + link.getDownStream());
            System.out.println("link direction id: " + link.getDirectionId());
        }

        System.out.println("Number of links: " + links.size());
    }

    private static List<Link> parseLinksXML() throws ParserConfigurationException, IOException, SAXException {
        List<Link> links = new ArrayList<Link>();
        Link link = null;

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new File("C:\\Links.xml"));
        // normalize the XML structure
        document.getDocumentElement().normalize();
        NodeList nlist = document.getElementsByTagName("Link");
        for (int i = 0; i < nlist.getLength(); i++) {
        //for (int i = 0; i < 5; i++) {
            Node node = nlist.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) node;
                link = new Link();
                link.setId(Integer.parseInt(element.getAttribute("DBFID")));
                link.setUpStream(Integer.parseInt(element.getAttribute("UpStream")));
                link.setDownStream(Integer.parseInt(element.getAttribute("DownStream")));
                link.setDirectionId(Integer.parseInt(element.getAttribute("Direction").split("_")[0]));

                links.add(link);
            }
        }

        return links;
    }
}
