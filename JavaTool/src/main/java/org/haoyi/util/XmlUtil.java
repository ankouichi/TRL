package org.haoyi.util;

import org.haoyi.entity.Link;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class XmlUtil {
    public static List<Link> parseLinksXML(String file) throws ParserConfigurationException, IOException, SAXException {
        List<Link> links = new ArrayList<>();
        Link link;

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new File(file));
        // normalize the XML structure
        document.getDocumentElement().normalize();
        NodeList nlist = document.getElementsByTagName("Link");
        for (int i = 0; i < nlist.getLength(); i++) {
            Node node = nlist.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) node;
                link = new Link();
                link.setId(Integer.parseInt(element.getAttribute("DBFID")));
                link.setUpStream(Integer.parseInt(element.getAttribute("UpStream")));
                link.setDownStream(Integer.parseInt(element.getAttribute("DownStream")));
                link.setDirectionId(Integer.parseInt(element.getAttribute("Direction").split("_")[0]));
                link.setDirection(  Integer.parseInt(element.getAttribute("Direction").split(" ")[1]));

                links.add(link);
            }
        }

        return links;
    }
}
