package no.nav.search.elastic;

import org.elasticsearch.client.Client;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeRequest;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeResponse.AnalyzeToken;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsRequest;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import no.nav.search.elastic.Token;

// DOCUMENTATION http://javadoc.kyubu.de/elasticsearch/v1.7.3/

@Component(immediate = true)
public class Analyze {
    private final static Logger LOG = LoggerFactory.getLogger( Analyze.class );
    private final static String ANALYZER = "navno_analyzer";

    private String text;

    public void setText(String text) {
        this.text = text;
    }

    public String getText() {
        return this.text;
    }

    private void createAnalyzer(){
        try {
            XContentBuilder settingsBuilder = XContentFactory.jsonBuilder()
            .startObject()
                .startObject("analysis")
                    .startObject("filter")
                        .startObject("nb_NO")
                            .field("type", "hunspell")
                            .field("language", "nb_NO")
                        .endObject()
                        .startObject("norwegian_stop")
                            .field("type", "stop")
                            .field("stopwords", "_norwegian_")
                        .endObject()
                    .endObject()
                    .startObject("analyzer")
                        .startObject("nb_NO")
                            .field("type", "custom")
                            .field("tokenizer", "standard")
                            .array("filter", "lowercase", "nb_NO", "norwegian_stop")
                        .endObject()
                    .endObject()
                .endObject()
            .endObject();
    
            ClientHolder.client.admin()
                .indices()
                .prepareCreate(this.ANALYZER).setSettings(settingsBuilder).get();
            } catch (Exception e) {
                LOG.info(e.toString());
                //TODO: handle exception
            }
    }

    private Boolean hasAnalyzer(String index){
        IndicesExistsRequest request = new IndicesExistsRequest(this.ANALYZER);
        return ClientHolder.client.admin()
            .indices()
            .exists(request)
            .actionGet()
            .isExists();
    }

    public List<Token> analyze() {
        if(!this.hasAnalyzer(this.ANALYZER)) {
            this.createAnalyzer();
        }

        AnalyzeRequest request = (new AnalyzeRequest())
            .analyzer("nb_NO")
            .text(this.text)
            .index(this.ANALYZER);
        List<AnalyzeToken> analyzeTokens = ClientHolder.client.admin()
            .indices()
            .analyze(request)
            .actionGet()
            .getTokens();
        List<Token> tokens = new ArrayList<Token>();
        for(AnalyzeToken analyseToken : analyzeTokens) {
            tokens.add(new Token(analyseToken));
        }
        return tokens;
    }

    @Component(immediate = true)
    public static class ClientHolder {
        public static Client client;
    
        @Reference
        public void setClient( final Client client )
        {
            this.client = client;
        }
    }
}
