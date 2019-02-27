# Counting Sheep in Ami Dongsuo
[CFGym101955F]

Ami Dongsuo, the god of the hills in Tibetan, guards the Qilian Mountains, whose Chinese name is Niuxin Mountain. Ami Dongsuo is a holy mountain which is famous for the fantastic love story about Zhuoer Mountain. The surrounding environments prompt Ami Dongsuo to form a huge sheep farmland.  
According to a shocking new report by the excellent ecologist Mr. Ma, Ami Dongsuo has 𝑛 different pastures in total. With the help of local herdsmen, Mr. Ma describes the number of sheep in each pasture and all paths between different pastures.  
Today, under his leadership, three adventurers Alice, Bob and Carol decide to visit some pastures in Ami Dongsuo. Mr. Ma has shown them a requirement, which is described by an integer 𝑘 that they should meet. These three adventurers will start their tours at the same pasture and visit three different routes, where their starting point is selected by themselves and thus it could be anywhere. Furthermore, a route may pass through one or more pastures. Since the altitude rises to nearly 5000 meters at the peak, and going up the hill or even climbing is quite a tiring job, adventurers have reached an agreement that the altitudes at all pastures in a route should be strictly decreasing in visiting order. If go along their routes respectively, they will finally arrive at some pastures, which may not be distinct. The requirement described by 𝑘 from Mr. Ma requires that the total number of sheep in these three destinations, considering with the multiplicities, is equal to 𝑘.  
Now, Mr. Ma hopes that someone can tell him, for any positive integer 𝑘, how many different plans exist for Alice, Bob and Carol that would meet what he requires. In this problem, we consider a plan as a set with three different routes sharing the common starting point. Two routes are considered different if their starting points vary or their sequences of visited paths in order vary. Two plans are considered different if at least one route that is contained in one plan but not in the other exists.

容易得到一个容斥的做法，设 F[i][w][1/2/3] 分别表示在 i 点，出发 1/2/3 条不同的路径权值和为 w 的方案数。转移是一个卷积的形式。暴力转移和 FFT 优化效果都不太好。注意到这个式子可以看作多项式，那么考虑插值，将 [0..3w] 的值带入，最后再插回来得到答案多项式。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define RG register
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=10100;
const int maxM=30300;
const int maxW=1205;
const int Mod=1e9+7;

class PolyC{
    public:
    int S[maxW];
    void Init(){
        mem(S,0);return;
    }
};

int n,m,W,WW;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],Dg[maxN],Nw[maxN];
int Pw[maxW][maxW],Fac[maxN],Ifc[maxN];
int Q[maxN];
int Poly[maxW],Ans[maxW],Lyop[maxW];
PolyC Dp[maxN][3],Y;

int QPow(int x,int cnt);
PolyC operator + (PolyC A,PolyC B);
PolyC operator * (PolyC A,PolyC B);

int main(){
    RG int i,j,k,lst;
    for (i=1;i<maxW;++i) for (j=Pw[i][0]=1;j<maxW;++j) Pw[i][j]=1ll*Pw[i][j-1]*i%Mod;
    Fac[0]=Ifc[0]=1;for (i=1;i<maxN;++i) Fac[i]=1ll*Fac[i-1]*i%Mod;
    Ifc[maxN-1]=QPow(Fac[maxN-1],Mod-2);for (i=maxN-2;i>=1;i--) Ifc[i]=1ll*Ifc[i+1]*(i+1)%Mod;
    int Case;scanf("%d",&Case);
    for (int ci=1;ci<=Case;++ci){
        edgecnt=-1;mem(Head,-1);mem(Dg,0);mem(Poly,0);mem(Ans,0);mem(Lyop,0);Y.Init();
        scanf("%d%d%d",&n,&m,&W);WW=W*3;
        for (i=1;i<=n;++i) Dp[i][1].Init(),Dp[i][2].Init();
        for (i=1;i<=n;++i) scanf("%d",&Nw[i]);
        for (i=1;i<=m;++i){
            int u,v;scanf("%d%d",&u,&v);
            Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;++Dg[v];
        }
        int qL=1,qR=0;
        for (i=1;i<=n;++i) if (Dg[i]==0) Q[++qR]=i;
        while (qL<=qR) for (int u=Q[qL++],i=Head[u];i!=-1;i=Next[i]) if ((--Dg[V[i]])==0) Q[++qR]=V[i];
        for (i=n;i>=1;i--){
            int u=Q[i];
            for (j=1;j<=WW;++j) Dp[u][0].S[j]=Pw[j][Nw[u]];
            for (j=Head[u];j!=-1;j=Next[j]){
                int v=V[j];
                Dp[u][2]=Dp[u][2]+Dp[v][2]+Dp[u][0]*Dp[v][1]+Dp[u][1]*Dp[v][0];
                Dp[u][1]=Dp[u][1]+Dp[v][1]+Dp[u][0]*Dp[v][0];
                Dp[u][0]=Dp[u][0]+Dp[v][0];
            }
            Y=Y+Dp[u][2];
        }
        Poly[0]=1;
        for (i=0;i<=WW;++i){
            k=(Mod-i)%Mod;
            for (j=WW+1;j>=1;j--) Lyop[j]=(Poly[j-1]+1ll*Poly[j]*k%Mod)%Mod;
            Lyop[0]=1ll*Poly[0]*k%Mod;
            for (j=0;j<=WW+1;++j) Poly[j]=Lyop[j];
        }
        for (i=0;i<=WW;++i){
            k=(Mod-i)%Mod;
            Lyop[WW+1]=0;
            for (j=WW+1,lst=0;j>=1;j--){
                lst=(lst+Poly[j])%Mod;Lyop[j-1]=lst;
                lst=(Mod-1ll*lst*k%Mod)%Mod;
            }
            int div=1;
            if (i!=0) div=1ll*div*Ifc[i]%Mod;
            if (i!=W*3) div=1ll*div*Ifc[W*3-i]%Mod;
            if ((W*3-i)&1) div=Mod-div;
            div=1ll*div*Y.S[i]%Mod;
            for (j=0;j<=WW;++j) Ans[j]=(Ans[j]+1ll*Lyop[j]*div%Mod)%Mod;
        }
        printf("Case #%d: ",ci);
        for (i=1;i<W*3;++i) printf("%d ",Ans[i]);printf("%d\n",Ans[W*3]);
    }
    return 0;
}
int QPow(int x,int cnt){
    x=(x+Mod)%Mod;
    int ret=1;
    while (cnt){
        if (cnt&1) ret=1ll*ret*x%Mod;
        x=1ll*x*x%Mod;cnt>>=1;
    }
    return ret;
}
PolyC operator + (PolyC A,PolyC B){
    PolyC R;
    for (int i=0;i<=WW;i++) R.S[i]=(A.S[i]+B.S[i])%Mod;
    return R;
}
PolyC operator * (PolyC A,PolyC B){
    PolyC R;
    for (int i=0;i<=WW;i++) R.S[i]=1ll*A.S[i]*B.S[i]%Mod;
    return R;
}
```